import { MiniGlyph, type Glyph } from "@/components/dock/pixel-matrix";
import { Reveal } from "@/components/about/about-cards";

// "Sözü göster": ilkelerdeki "Sürpriz yok" ve "İyi iş ölçülür" sözlerinin somut hali. Referans: Finns şablonunun
// özellik satırları (solda etiket + başlık, sağda mini arayüz kartları ve altında kalın vurgulu açıklama).
// Mini arayüzler OX Panel ve aylık raporun temsilî görüntüleri; metin ve rakamlar YER TUTUCU.

type Caption = { strong: string; rest: string; strongFirst?: boolean };

function Label({ glyph, children }: { glyph: Glyph; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[15px] tracking-[-0.01em] text-[#111]">
      <span className="grid size-9 place-items-center rounded-[11px] bg-accent text-[#111]">
        <MiniGlyph glyph={glyph} cell={3} />
      </span>
      {children}
    </p>
  );
}

function Tile({ caption, children }: { caption: Caption; children: React.ReactNode }) {
  return (
    <figure>
      <div className="grid h-[250px] place-items-center rounded-[28px] bg-[#F1F1F1] p-5 md:p-6">{children}</div>
      <figcaption className="mt-5 max-w-[40ch] text-[15px] leading-[1.45] text-neutral-500">
        {caption.strongFirst ? (
          <>
            <b className="font-semibold text-[#111]">{caption.strong}</b> {caption.rest}
          </>
        ) : (
          <>
            {caption.rest} <b className="font-semibold text-[#111]">{caption.strong}</b>.
          </>
        )}
      </figcaption>
    </figure>
  );
}

function Check({ dark = false }: { dark?: boolean }) {
  return (
    <span
      className={`grid size-5 shrink-0 place-items-center rounded-full ${dark ? "bg-[#111] text-accent" : "bg-accent text-[#111]"}`}
    >
      <svg viewBox="0 0 12 12" className="size-2.5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
        <path d="m2.5 6.2 2.2 2.2 4.8-4.8" />
      </svg>
    </span>
  );
}

function Grip() {
  return (
    <span aria-hidden className="grid grid-cols-2 gap-[3px] opacity-40">
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i} className="size-[3px] rounded-full bg-current" />
      ))}
    </span>
  );
}

function Chip({
  children,
  removable = false,
  grip = false,
}: {
  children: React.ReactNode;
  removable?: boolean;
  grip?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 ${removable ? "bg-accent/70 text-[#111]" : "bg-white text-[#111]"}`}
    >
      {children}
      {grip && <Grip />}
      {removable && <span className="text-[13px] leading-none text-[#111]/60">×</span>}
    </span>
  );
}

/* --- Mini arayüzler --- */

const STEPS = [
  { name: "Strateji", status: "Tamamlandı", state: "done" },
  { name: "Tasarım", status: "Onayını bekliyor", state: "now" },
  { name: "Yazılım", status: "Sırada", state: "next" },
] as const;

function StepsMock() {
  return (
    <div className="w-full max-w-[400px] rounded-[20px] bg-white p-2 text-[14px]">
      {STEPS.map((s) => (
        <div
          key={s.name}
          className={`flex items-center gap-3 rounded-[14px] px-3.5 py-3 ${s.state === "now" ? "bg-[#F6F6F6]" : ""}`}
        >
          {s.state === "done" ? (
            <Check />
          ) : (
            <span
              className={`size-5 shrink-0 rounded-full border-2 ${s.state === "now" ? "border-[#111]" : "border-neutral-300"}`}
            />
          )}
          <span className={s.state === "next" ? "text-neutral-400" : "text-[#111]"}>{s.name}</span>
          <span className={`ml-auto text-[13px] ${s.state === "now" ? "font-medium text-[#111]" : "text-neutral-400"}`}>
            {s.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function ApprovalMock() {
  return (
    <div className="w-full max-w-[400px] text-[14px]">
      <div className="flex items-center gap-3 rounded-full bg-white p-1.5 pl-1.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#111] font-mono text-[10px] font-bold text-accent">
          OX
        </span>
        <span className="min-w-0 truncate text-[#111]">Ana sayfa tasarımı hazır</span>
        <span className="ml-auto shrink-0 rounded-full bg-[#111] px-4 py-2 font-medium text-white">Onayla</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Masaüstü", "Mobil", "Metinler"].map((c) => (
          <span
            key={c}
            className="inline-flex items-center gap-2 rounded-full bg-accent/70 py-1.5 pl-1.5 pr-3.5 text-[#111]"
          >
            <Check dark />
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function RuleMock() {
  return (
    <div className="flex max-w-[360px] flex-wrap items-center justify-center gap-x-2.5 gap-y-2.5 text-[14px] text-neutral-500">
      <span>Eğer</span>
      <Chip grip>tıklama maliyeti</Chip>
      <Chip removable>&gt; ₺40</Chip>
      <span>ise</span>
      <Chip grip>bütçeyi kaydır</Chip>
      <span>şuraya</span>
      <Chip removable>Google</Chip>
      <Chip removable>Meta</Chip>
    </div>
  );
}

function ReportMock() {
  return (
    <div className="w-full max-w-[400px] overflow-hidden rounded-[20px] bg-white text-[14px]">
      <div className="flex items-center gap-3 p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#F1F1F1] text-[#111]">
          <MiniGlyph glyph="bars" cell={3} />
        </span>
        <span className="leading-[1.3]">
          <span className="block text-[13px] text-neutral-500">Ekim raporu</span>
          <span className="block text-[#111]">Siteden gelen talep</span>
        </span>
        <span className="ml-auto rounded-full border border-black/10 px-2.5 py-1 font-medium text-[#111]">+%38</span>
      </div>
      <div className="flex items-center gap-3 bg-[#F6F6F6] px-4 py-3.5">
        <span className="text-[#111]">
          <Grip />
        </span>
        <span className="grid size-7 place-items-center rounded-[8px] bg-accent text-[#111]">
          <MiniGlyph glyph="trend" cell={2} />
        </span>
        <span className="min-w-0 truncate text-[#111]">
          Google Ads <span className="text-neutral-400">(son 30 gün)</span>
        </span>
      </div>
    </div>
  );
}

function ChatMock() {
  return (
    <div className="flex w-full max-w-[400px] flex-col gap-2.5 text-[14px]">
      <p className="max-w-[85%] self-end rounded-[18px] rounded-br-[6px] bg-white px-4 py-2.5 text-[#111]">
        Kampanya sayfasına yeni fiyatı ekleyebilir misiniz?
      </p>
      <div className="flex items-end gap-2">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#111] font-mono text-[9px] font-bold text-accent">
          OX
        </span>
        <p className="rounded-[18px] rounded-bl-[6px] bg-accent/70 px-4 py-2.5 text-[#111]">
          Eklendi, yayında <span aria-hidden>✓</span>
        </p>
      </div>
      <span className="pl-10 font-mono text-[11px] text-neutral-400">14:02 · 18 dk içinde</span>
    </div>
  );
}

const OWNED = [
  { name: "Alan adı", note: "senin adına" },
  { name: "Tasarım dosyaları", note: "teslim edildi" },
  { name: "Reklam hesapları", note: "yönetici sensin" },
];

function OwnershipMock() {
  return (
    <div className="w-full max-w-[400px] rounded-[20px] bg-white p-2 text-[14px]">
      {OWNED.map((o) => (
        <div key={o.name} className="flex items-center gap-3 rounded-[14px] px-3.5 py-3">
          <Check />
          <span className="text-[#111]">{o.name}</span>
          <span className="ml-auto text-[13px] text-neutral-400">{o.note}</span>
        </div>
      ))}
    </div>
  );
}

const ROWS = [
  {
    glyph: "browser",
    label: "OX Panel",
    title: "Projen her an gözünün önünde.",
    text: "Ne yapıldığını, sırada ne olduğunu ve ne zaman biteceğini kimseye sormana gerek kalmaz.",
    tiles: [
      {
        mock: <StepsMock />,
        caption: {
          strong: "Her adımı",
          rest: "panelden takip edersin; hangi işin nerede olduğu hep belli.",
          strongFirst: true,
        },
      },
      {
        mock: <ApprovalMock />,
        caption: {
          strong: "onayın olmadan yayına çıkmaz",
          rest: "Taslaklar panele düşer; hiçbir şey",
        },
      },
    ],
  },
  {
    glyph: "bars",
    label: "Ölçüm",
    title: "Sonucu raporla konuşuruz.",
    text: "Her ay neyin işe yaradığını, neyin yaramadığını sade bir dille paylaşırız.",
    tiles: [
      {
        mock: <RuleMock />,
        caption: {
          strong: "Kurallarla izleriz:",
          rest: "bir kampanya pahalılaşınca bütçe beklemeden daha iyi çalışana kayar.",
          strongFirst: true,
        },
      },
      {
        mock: <ReportMock />,
        caption: {
          strong: "Her ay sade bir rapor:",
          rest: "ne harcandı, karşılığında ne geldi.",
          strongFirst: true,
        },
      },
    ],
  },
  {
    glyph: "check",
    label: "Teslimden sonra",
    title: "Yayına çıkınca da yanındayız.",
    text: "Bir değişiklik mi lazım, bir sorun mu var? Kime yazacağını düşünmeden tek mesajla ulaşırsın.",
    tiles: [
      {
        mock: <ChatMock />,
        caption: {
          strong: "Tek mesajla",
          rest: "değişiklik istersin; işin kimde olduğunu takip etmek bize düşer.",
          strongFirst: true,
        },
      },
      {
        mock: <OwnershipMock />,
        caption: { strong: "tamamen senin", rest: "Dosyalar, hesaplar ve kod" },
      },
    ],
  },
] satisfies {
  glyph: Glyph;
  label: string;
  title: string;
  text: string;
  tiles: { mock: React.ReactNode; caption: Caption }[];
}[];

export function AboutShowcase() {
  return (
    <section data-dock="surec" className="space-y-24 bg-background px-4 pb-28 md:space-y-32 md:px-[4.5vw] md:pb-36">
      {ROWS.map((row) => (
        <div key={row.label} className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <Reveal>
            <Label glyph={row.glyph}>{row.label}</Label>
            <h2 className="mt-8 max-w-[11em] text-[clamp(32px,3vw,52px)] font-medium leading-[1.06] tracking-[-0.045em] text-[#111]">
              {row.title}
            </h2>
            <p className="mt-6 max-w-[30em] text-[clamp(16px,1.15vw,19px)] leading-[1.45] text-neutral-500">{row.text}</p>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2">
            {row.tiles.map((t, i) => (
              <Reveal key={i} index={i + 1}>
                <Tile caption={t.caption}>{t.mock}</Tile>
              </Reveal>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
