import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Copy,
  Check,
  ShieldAlert,
  Key,
  Download,
  Loader2,
  Code2,
  Database,
  AlertTriangle,
  Info,
} from "lucide-react";

export const Route = createFileRoute("/painel-migracao")({
  head: () => ({
    meta: [
      { title: "Painel de Migração" },
      { name: "description", content: "Coleta ordenada de credenciais para migração do backend." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PainelMigracao,
});

type MigrationData = {
  project_url?: string;
  anon_key?: string;
  service_role_key?: string;
  secrets?: Record<string, string>;
  edge_functions?: string[];
  edge_functions_count?: number;
  database_tables?: Array<{
    tablename: string;
    row_count: number;
    column_count: number;
    encrypted_columns: string[] | null;
    has_user_id: boolean;
  }>;
  database_tables_error?: string | null;
};

function mask(value: string): string {
  if (!value) return "";
  if (value.length <= 24) return value;
  return `${value.slice(0, 12)}•••••${value.slice(-8)}`;
}

function classifyTable(t: {
  tablename: string;
  row_count: number;
  has_user_id: boolean;
}): "Essencial" | "Histórico" | "Ignorar" {
  const name = t.tablename.toLowerCase();
  if (/(log|audit|history|events?|analytics|metrics|tmp|temp|cache)/.test(name)) {
    return "Histórico";
  }
  if (t.row_count === 0 && !t.has_user_id) return "Ignorar";
  return "Essencial";
}

function download(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function copyText(value: string): Promise<boolean> {
  // Try modern async clipboard first
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // fall through to legacy fallback (permissions-policy in iframes blocks the async API)
  }
  // Legacy fallback — works inside sandboxed iframes (like the Lovable preview)
  try {
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "0";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, value.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

function CopyButton({ value, label = "Copiar" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={async () => {
        const ok = await copyText(value);
        if (ok) {
          setCopied(true);
          toast.success("Copiado");
          setTimeout(() => setCopied(false), 1500);
        } else {
          toast.error("Não foi possível copiar. Abra em nova aba.");
        }
      }}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {label}
    </Button>
  );
}

function SecretRow({ name, value }: { name: string; value: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium text-muted-foreground">{name}</div>
        <div className="truncate font-mono text-sm">{show ? value : mask(value)}</div>
      </div>
      <Button size="icon" variant="ghost" onClick={() => setShow((s) => !s)}>
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
      <CopyButton value={value} label="" />
    </div>
  );
}

function StepCard({
  step,
  icon: Icon,
  title,
  children,
}: {
  step: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground font-semibold">
          {step}
        </div>
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">
          Passo {step} — {title}
        </h2>
      </div>
      {children}
    </Card>
  );
}

function PainelMigracao() {
  const [data, setData] = useState<MigrationData | null>(null);
  const [loading, setLoading] = useState(false);

  const supabaseUrl =
    (import.meta as { env?: { VITE_SUPABASE_URL?: string } }).env?.VITE_SUPABASE_URL ?? "";

  const revealAll = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`${supabaseUrl}/functions/v1/painel-migracao`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!r.ok) {
        const t = await r.text();
        throw new Error(t || `HTTP ${r.status}`);
      }
      const json = (await r.json()) as MigrationData;
      setData(json);
      toast.success("Dados carregados");
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error(`Falha: ${msg}`);
    } finally {
      setLoading(false);
    }
  }, [supabaseUrl]);

  const edgeFunctionsCode = useMemo(() => {
    const modules = import.meta.glob("/supabase/functions/*/index.ts", {
      query: "?raw",
      import: "default",
      eager: true,
    }) as Record<string, string>;
    const parts: string[] = [];
    for (const [path, code] of Object.entries(modules)) {
      const name = path.split("/").slice(-2, -1)[0];
      parts.push(`// ═══ ${name} ═══\n${code}`);
    }
    return { code: parts.join("\n\n"), count: Object.keys(modules).length };
  }, []);

  const downloadEdgeFunctions = () => {
    download("edge-functions.ts", edgeFunctionsCode.code, "text/typescript");
    toast.success(`${edgeFunctionsCode.count} função(ões) exportada(s)`);
  };

  const downloadSecrets = () => {
    const secrets = data?.secrets ?? {};
    const entries = Object.entries(secrets)
      .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`)
      .join("\n");
    const content = `// Gerado pelo Painel de Migração\nexport const SECRETS = {\n${entries}\n} as const;\n\nexport type SecretKey = keyof typeof SECRETS;\n`;
    download("secrets.ts", content, "text/typescript");
    toast.success(`${Object.keys(secrets).length} secret(s) exportado(s)`);
  };

  const copyAll = () => {
    if (!data) return;
    const secretsText = Object.entries(data.secrets ?? {})
      .map(([k, v]) => `${k}=${v}`)
      .join("\n");
    const text = [
      "═══ CREDENCIAIS ═══",
      `PROJECT_URL=${data.project_url ?? ""}`,
      `ANON_KEY=${data.anon_key ?? ""}`,
      `SERVICE_ROLE_KEY=${data.service_role_key ?? ""}`,
      "",
      "═══ EDGE FUNCTIONS ═══",
      (data.edge_functions ?? []).join("\n"),
      "",
      "═══ SECRETS ═══",
      secretsText,
    ].join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Tudo copiado");
  };

  const extraSecrets = data?.secrets ?? {};
  const tables = data?.database_tables ?? [];

  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Painel de Migração</h1>
          <p className="text-muted-foreground">
            Copie os itens abaixo na ordem e cole na extensão CloneSupa.
          </p>
        </header>

        <div className="flex flex-wrap gap-3">
          <Button size="lg" onClick={revealAll} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            Revelar Tudo
          </Button>
          <Button size="lg" variant="outline" onClick={copyAll} disabled={!data}>
            <Copy className="h-4 w-4" />
            Copiar Tudo
          </Button>
        </div>

        {/* Passo 1 */}
        <StepCard step={1} icon={ShieldAlert} title="Credenciais">
          {data ? (
            <div className="space-y-3">
              <SecretRow name="Project URL" value={data.project_url ?? ""} />
              <SecretRow name="Anon Key" value={data.anon_key ?? ""} />
              <SecretRow name="Service Role Key" value={data.service_role_key ?? ""} />
              <div className="flex flex-wrap gap-2 pt-2">
                <CopyButton value={data.project_url ?? ""} label="Copiar Project URL" />
                <CopyButton
                  value={data.service_role_key ?? ""}
                  label="Copiar Service Role Key"
                />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Clique em "Revelar Tudo" para carregar as credenciais.
            </p>
          )}
        </StepCard>

        {/* Passo 2 */}
        <StepCard step={2} icon={Code2} title="Edge Functions">
          {data ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {(data.edge_functions ?? []).map((n) => (
                  <Badge key={n} variant="secondary">
                    {n}
                  </Badge>
                ))}
                {(data.edge_functions ?? []).length === 0 && (
                  <span className="text-sm text-muted-foreground">Nenhuma encontrada.</span>
                )}
              </div>
              <Button variant="outline" onClick={downloadEdgeFunctions}>
                <Download className="h-4 w-4" />
                Baixar edge-functions.ts
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Aguardando "Revelar Tudo"…
            </p>
          )}
        </StepCard>

        {/* Passo 3 */}
        <StepCard step={3} icon={Key} title="Secrets">
          {data ? (
            <div className="space-y-3">
              {Object.keys(extraSecrets).length === 0 && (
                <p className="text-sm text-muted-foreground">Nenhum secret extra configurado.</p>
              )}
              {Object.entries(extraSecrets).map(([k, v]) => (
                <SecretRow key={k} name={k} value={v} />
              ))}
              <Button variant="outline" onClick={downloadSecrets}>
                <Download className="h-4 w-4" />
                Baixar secrets.ts
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aguardando "Revelar Tudo"…</p>
          )}
        </StepCard>

        {/* Passo 4 */}
        <StepCard step={4} icon={Database} title="Conferência">
          {data ? (
            <div className="space-y-4">
              <div className="rounded-md border border-border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="font-medium">Tabelas do banco</div>
                  <Badge variant="outline">{tables.length}</Badge>
                </div>
                {data.database_tables_error ? (
                  <p className="text-sm text-destructive">{data.database_tables_error}</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {tables.map((t) => {
                      const cls = classifyTable(t);
                      return (
                        <li
                          key={t.tablename}
                          className="flex items-center justify-between gap-3 rounded border border-border/60 px-3 py-2"
                        >
                          <div className="min-w-0">
                            <div className="font-mono">{t.tablename}</div>
                            <div className="text-xs text-muted-foreground">
                              {t.row_count} linhas · {t.column_count} colunas
                              {t.has_user_id ? " · user_id" : ""}
                              {t.encrypted_columns && t.encrypted_columns.length > 0
                                ? ` · sensíveis: ${t.encrypted_columns.join(", ")}`
                                : ""}
                            </div>
                          </div>
                          <Badge
                            variant={
                              cls === "Essencial"
                                ? "default"
                                : cls === "Histórico"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {cls}
                          </Badge>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="flex items-start gap-2 rounded-md border border-border bg-muted/40 p-3 text-sm">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p>
                  <strong>Aviso sobre senhas:</strong> as senhas são copiadas como hash bcrypt. Se
                  o JWT secret do destino mudar, as sessões antigas caem — mas as senhas continuam
                  válidas e os usuários podem entrar normalmente.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Aguardando "Revelar Tudo"…</p>
          )}
        </StepCard>

        <div className="flex items-start gap-2 rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Página pública temporária. Apague a rota <code>/painel-migracao</code> e as edge
            functions <code>migrate-sql</code> / <code>painel-migracao</code> depois de concluída
            a migração.
          </p>
        </div>
      </div>
    </div>
  );
}
