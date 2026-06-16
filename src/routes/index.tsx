import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Star,
  Check,
  ShieldCheck,
  Sparkles,
  Clock,
  Target,
  Zap,
  PlayCircle,
  Award,
  Users,
  TrendingUp,
} from "lucide-react";
import heroMockup from "@/assets/hero-mockup.jpg";

const CTA_URL = "#oferta";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Método Fluxo — Domine seu mercado em 8 semanas" },
      {
        name: "description",
        content:
          "Curso online completo com método validado por +3.000 alunos. Garantia incondicional de 7 dias. Comece hoje.",
      },
      { property: "og:title", content: "Método Fluxo — Domine seu mercado em 8 semanas" },
      {
        property: "og:description",
        content:
          "Curso online completo com método validado por +3.000 alunos. Garantia de 7 dias.",
      },
      { property: "og:type", content: "product" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: SalesPage,
});

function SalesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <Pains />
        <Benefits />
        <Demo />
        <Testimonials />
        <Offer />
        <Guarantee />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          Método Fluxo
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#beneficios" className="transition-colors hover:text-foreground">Benefícios</a>
          <a href="#depoimentos" className="transition-colors hover:text-foreground">Depoimentos</a>
          <a href="#oferta" className="transition-colors hover:text-foreground">Oferta</a>
          <a href="#faq" className="transition-colors hover:text-foreground">FAQ</a>
        </nav>
        <Button asChild size="sm">
          <a href={CTA_URL}>Comprar agora</a>
        </Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section
      className="relative overflow-hidden px-6 pt-16 pb-20 md:pt-24 md:pb-28"
      style={{ background: "var(--gradient-hero)" }}
    >
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <Badge variant="secondary" className="mb-5 gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Turma de junho com vagas limitadas
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Domine seu mercado em{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              8 semanas
            </span>{" "}
            com um método validado.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Um passo a passo prático, com aulas curtas e ferramentas prontas, para você sair do
            zero e construir resultado real, sem enrolação.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="h-12 px-6 text-base">
              <a href={CTA_URL}>Quero garantir minha vaga</a>
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <span>4.9/5 · 3.218 alunos</span>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Acesso vitalício</span>
            <span className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Certificado incluso</span>
            <span className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Garantia 7 dias</span>
          </div>
        </div>
        <div className="relative">
          <div
            className="overflow-hidden rounded-2xl border border-border"
            style={{ boxShadow: "var(--shadow-elegant)" }}
          >
            <img
              src={heroMockup}
              alt="Mockup da plataforma Método Fluxo em notebook e celular"
              width={1920}
              height={1080}
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const stats = [
    { icon: Users, value: "3.218", label: "alunos ativos" },
    { icon: Award, value: "94%", label: "concluem o curso" },
    { icon: TrendingUp, value: "8x", label: "ROI médio relatado" },
    { icon: Clock, value: "30min", label: "por dia em média" },
  ];
  return (
    <section className="border-y border-border bg-secondary/50 py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 md:grid-cols-4">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-primary" />
            <div>
              <div className="text-xl font-semibold">{value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pains() {
  const items = [
    {
      title: "Você sente que está sempre começando do zero",
      text: "Cada novo projeto é uma luta — falta um sistema repetível que dê previsibilidade.",
    },
    {
      title: "Consome conteúdo sem aplicar",
      text: "Cursos, lives, e-books… e mesmo assim a sensação é de estar parado no mesmo lugar.",
    },
    {
      title: "Resultado não vem na velocidade que precisa",
      text: "Sem método claro, o esforço se dilui e o desânimo bate antes do retorno.",
    },
  ];
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Se você se identifica com algo disso, este curso é para você.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Os mesmos obstáculos travam 9 em cada 10 pessoas. A boa notícia: todos têm solução.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((i) => (
            <Card key={i.title} className="p-6">
              <h3 className="font-semibold">{i.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{i.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  const items = [
    {
      icon: Target,
      title: "Método claro e direto",
      text: "Um framework em 4 etapas para sair da paralisia e entregar resultado mensurável.",
    },
    {
      icon: Zap,
      title: "Aulas práticas e curtas",
      text: "Cada módulo cabe na sua semana. Faça em 30 minutos por dia.",
    },
    {
      icon: ShieldCheck,
      title: "Templates prontos",
      text: "Mais de 40 planilhas, scripts e checklists para acelerar sua execução.",
    },
  ];
  return (
    <section id="beneficios" className="bg-secondary/40 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">Como funciona</Badge>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Tudo o que você precisa, organizado em um só lugar.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="p-6">
              <div
                className="grid h-12 w-12 place-items-center rounded-xl text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Demo() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div className="relative">
          <div
            className="overflow-hidden rounded-2xl border border-border"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <img
              src={heroMockup}
              alt="Plataforma do curso em uso"
              width={1920}
              height={1080}
              loading="lazy"
              className="h-auto w-full"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 hidden md:block">
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm shadow-md">
              <PlayCircle className="h-4 w-4 text-primary" />
              60+ aulas em HD
            </div>
          </div>
        </div>
        <div>
          <Badge variant="outline" className="mb-4">Conheça a plataforma</Badge>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Estude no seu ritmo, com tudo registrado.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Acompanhe o progresso, retome de onde parou e baixe materiais quando quiser. Acesso
            por web e mobile, sem custo extra.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {[
              "8 módulos com aulas em vídeo HD",
              "Comunidade ativa de alunos",
              "Mentoria em grupo mensal",
              "Atualizações vitalícias",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    {
      name: "Carolina M.",
      role: "Empreendedora",
      text: "Em 6 semanas eu organizei minha operação e dobrei meu faturamento. O método é direto ao ponto.",
    },
    {
      name: "Ricardo S.",
      role: "Consultor",
      text: "Já fiz vários cursos, este é o único que realmente entrega o que promete. Templates valem o investimento sozinhos.",
    },
    {
      name: "Aline P.",
      role: "Designer freelancer",
      text: "Saí do desespero para uma agenda cheia em 2 meses. Mudou minha relação com o trabalho.",
    },
  ];
  return (
    <section id="depoimentos" className="bg-secondary/40 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Resultados reais de quem aplicou.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <Card key={t.name} className="p-6">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed">"{t.text}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 font-semibold text-primary">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Offer() {
  const bullets = [
    "Acesso vitalício a todas as aulas",
    "+40 templates prontos para uso",
    "Comunidade exclusiva de alunos",
    "Mentoria em grupo mensal",
    "Certificado de conclusão",
    "Atualizações gratuitas para sempre",
  ];
  return (
    <section id="oferta" className="px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <Badge variant="outline" className="mb-4">Oferta de lançamento</Badge>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Comece hoje por menos do que um almoço por semana.
          </h2>
        </div>
        <Card
          className="overflow-hidden border-2 border-primary/20 p-8 md:p-10"
          style={{ boxShadow: "var(--shadow-elegant)" }}
        >
          <div className="flex flex-col items-center text-center">
            <Badge className="mb-4">Mais escolhido</Badge>
            <h3 className="text-2xl font-semibold">Método Fluxo Completo</h3>
            <div className="mt-6">
              <div className="text-sm text-muted-foreground line-through">De R$ 1.497</div>
              <div className="mt-1 flex items-baseline justify-center gap-2">
                <span className="text-5xl font-semibold tracking-tight">R$ 497</span>
                <span className="text-muted-foreground">à vista</span>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">ou 12x de R$ 49,70</div>
            </div>
            <ul className="mt-8 grid w-full gap-3 text-left sm:grid-cols-2">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Button asChild size="lg" className="mt-8 h-12 w-full px-6 text-base sm:w-auto">
              <a href={CTA_URL}>Quero entrar agora</a>
            </Button>
            <div className="mt-3 text-xs text-muted-foreground">
              Pagamento 100% seguro · Cartão, Pix e boleto
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function Guarantee() {
  return (
    <section className="px-6 pb-20">
      <div className="mx-auto max-w-3xl">
        <Card className="flex flex-col items-center gap-6 p-8 text-center md:flex-row md:text-left">
          <div
            className="grid h-16 w-16 shrink-0 place-items-center rounded-full text-primary-foreground"
            style={{ background: "var(--gradient-primary)" }}
          >
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Garantia incondicional de 7 dias</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Teste o método por uma semana. Se não for para você, devolvemos 100% do valor sem
              perguntas. O risco é todo nosso.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "Por quanto tempo tenho acesso?",
      a: "Acesso vitalício. Você compra uma vez e pode revisitar quando quiser, incluindo todas as atualizações futuras.",
    },
    {
      q: "Preciso de conhecimento prévio?",
      a: "Não. O curso foi desenhado para quem está começando, mas também aprofunda em estratégias avançadas.",
    },
    {
      q: "Como funciona a garantia?",
      a: "Você tem 7 dias corridos após a compra para pedir reembolso integral. Basta enviar um e-mail, sem burocracia.",
    },
    {
      q: "Quanto tempo por dia preciso dedicar?",
      a: "Em média 30 minutos por dia. As aulas são curtas e práticas para caberem na rotina.",
    },
    {
      q: "Posso parcelar?",
      a: "Sim, em até 12x no cartão de crédito. Também aceitamos Pix e boleto.",
    },
    {
      q: "Recebo certificado?",
      a: "Sim. Ao concluir 100% das aulas você recebe certificado digital com carga horária.",
    },
  ];
  return (
    <section id="faq" className="bg-secondary/40 px-6 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Perguntas frequentes
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="px-6 py-20 md:py-28">
      <div
        className="mx-auto max-w-5xl overflow-hidden rounded-3xl p-10 text-center text-primary-foreground md:p-16"
        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-elegant)" }}
      >
        <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
          A próxima turma fecha em breve.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base opacity-90 md:text-lg">
          Garanta sua vaga hoje e comece a transformar seus resultados ainda esta semana.
        </p>
        <Button asChild size="lg" variant="secondary" className="mt-8 h-12 px-8 text-base">
          <a href={CTA_URL}>Quero minha vaga agora</a>
        </Button>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="grid h-6 w-6 place-items-center rounded bg-primary text-primary-foreground">
            <Sparkles className="h-3 w-3" />
          </span>
          Método Fluxo
        </div>
        <nav className="flex gap-6 text-sm text-muted-foreground">
          <a href="#" className="transition-colors hover:text-foreground">Termos</a>
          <a href="#" className="transition-colors hover:text-foreground">Privacidade</a>
          <a href="#" className="transition-colors hover:text-foreground">Contato</a>
        </nav>
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Método Fluxo. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
