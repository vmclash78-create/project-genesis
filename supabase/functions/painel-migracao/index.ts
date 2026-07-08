// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, apikey",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const SYSTEM_VARS = new Set([
  "PATH",
  "HOME",
  "DENO_DIR",
  "HOSTNAME",
  "PORT",
  "TMPDIR",
  "USER",
  "LANG",
  "TERM",
  "_",
  "DENO_REGION",
  "DENO_DEPLOYMENT_ID",
]);

// Names of edge functions to probe. Keep this in sync with supabase/functions/.
const knownFunctionNames = ["migrate-sql", "painel-migracao"];

function isSystemVar(name: string) {
  if (SYSTEM_VARS.has(name)) return true;
  if (name.startsWith("XDG_")) return true;
  return false;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const env = Deno.env.toObject();
    const SUPABASE_URL = env.SUPABASE_URL ?? "";
    const project_url = SUPABASE_URL;
    const anon_key =
      env.SUPABASE_ANON_KEY ??
      env.SUPABASE_PUBLISHABLE_KEY ??
      "";
    const service_role_key = env.SUPABASE_SERVICE_ROLE_KEY ?? "";

    // Collect all other secrets (extras), filtered.
    const reservedKeys = new Set([
      "SUPABASE_URL",
      "SUPABASE_ANON_KEY",
      "SUPABASE_PUBLISHABLE_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
      "SUPABASE_DB_URL",
    ]);
    const secrets: Record<string, string> = {};
    for (const [k, v] of Object.entries(env)) {
      if (isSystemVar(k)) continue;
      if (reservedKeys.has(k)) continue;
      secrets[k] = v;
    }

    // Probe edge functions.
    const probes = await Promise.allSettled(
      knownFunctionNames.map(async (name) => {
        const url = `${SUPABASE_URL}/functions/v1/${name}`;
        const r = await fetch(url, { method: "OPTIONS" });
        return { name, status: r.status };
      }),
    );
    const edge_functions: string[] = [];
    for (const p of probes) {
      if (p.status === "fulfilled" && p.value.status < 500) {
        edge_functions.push(p.value.name);
      }
    }

    // Discover DB tables via exec_sql (service_role).
    let database_tables: any[] = [];
    let database_tables_error: string | null = null;
    try {
      const admin = createClient(SUPABASE_URL, service_role_key);
      const sql_query = `
        SELECT
          t.tablename,
          COALESCE((SELECT n_live_tup FROM pg_stat_user_tables s
                    WHERE s.schemaname = t.schemaname AND s.relname = t.tablename), 0) AS row_count,
          (SELECT COUNT(*) FROM information_schema.columns c
            WHERE c.table_schema = t.schemaname AND c.table_name = t.tablename) AS column_count,
          COALESCE((SELECT array_agg(c.column_name)
                    FROM information_schema.columns c
                    WHERE c.table_schema = t.schemaname
                      AND c.table_name = t.tablename
                      AND (c.column_name ILIKE '%password%'
                        OR c.column_name ILIKE '%secret%'
                        OR c.column_name ILIKE '%token%'
                        OR c.column_name ILIKE '%encrypted%')), ARRAY[]::text[]) AS encrypted_columns,
          EXISTS (SELECT 1 FROM information_schema.columns c
                  WHERE c.table_schema = t.schemaname
                    AND c.table_name = t.tablename
                    AND c.column_name = 'user_id') AS has_user_id
        FROM pg_tables t
        WHERE t.schemaname = 'public'
        ORDER BY t.tablename
      `;
      const { data, error } = await admin.rpc("exec_sql", { sql_query });
      if (error) {
        database_tables_error = error.message;
      } else if (Array.isArray(data)) {
        database_tables = data;
      }
    } catch (e: any) {
      database_tables_error = e?.message ?? String(e);
    }

    const payload = {
      project_url,
      anon_key,
      service_role_key,
      secrets,
      edge_functions,
      edge_functions_count: edge_functions.length,
      database_tables,
      database_tables_error,
    };

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message ?? String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
