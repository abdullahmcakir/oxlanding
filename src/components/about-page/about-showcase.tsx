import { MiniGlyph, type Glyph } from "@/components/dock/pixel-matrix";
import { Reveal } from "@/components/about/about-cards";

// "Sözü göster": ilkelerdeki "Sürpriz yok" ve "İyi iş ölçülür" sözlerinin somut hali. Referans: Finns şablonunun
// özellik satırları (solda etiket + başlık, sağda mini arayüz kartları ve altında kalın vurgulu açıklama).
// Mini arayüzler OX Panel, ölçüm kuralı ve aylık raporun temsilî görüntüleri: hepsi aynı beyaz panel kalıbında
// (üstte mono başlık satırı, içinde anlattığı fikre özel tek bir arayüz parçası). İçlerindeki rakamlar örnektir.

type Caption = { strong: string; rest: string };

function Label({ glyph, children }: { glyph: Glyph; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[15px] tracking-[-0.01em] text-[#111]">
      <span className="grid size-9 place-items-center rounded-[11px] bg-accent text-accent-ink">
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
        <b className="font-semibold text-[#111]">{caption.strong}</b> {caption.rest}
      </figcaption>
    </figure>
  );
}

/** Mini arayüzlerin ortak kalıbı: beyaz panel, üstte mono başlık ve sağında kısa durum bilgisi */
function Panel({ title, meta, children }: { title: string; meta?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[400px] rounded-[20px] bg-white p-4 text-[14px] text-[#111]">
      <div className="mb-3 flex items-center justify-between gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">
        <span className="truncate">{title}</span>
        {meta && <span className="shrink-0 font-sans text-[12px] font-medium normal-case tracking-normal">{meta}</span>}
      </div>
      {children}
    </div>
  );
}

function Check({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-accent text-accent-ink ${size === "sm" ? "size-4" : "size-5"}`}
    >
      <svg viewBox="0 0 12 12" className={size === "sm" ? "size-2" : "size-2.5"} fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
        <path d="m2.5 6.2 2.2 2.2 4.8-4.8" />
      </svg>
    </span>
  );
}

/** Kısa durum rozeti: mavi (aktif), gri (bekleyen/pasif) */
function Pill({ tone = "muted", children }: { tone?: "accent" | "muted"; children: React.ReactNode }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-medium ${tone === "accent" ? "bg-accent/10 text-accent" : "bg-[#F1F1F1] text-neutral-500"}`}
    >
      {children}
    </span>
  );
}

/* --- Mini arayüzler --- */

const STEPS = [
  { name: "Strateji", status: "Tamamlandı", state: "done" },
  { name: "Tasarım", status: "Onay bekliyor", state: "now" },
  { name: "Yazılım", status: "Sırada", state: "next" },
] as const;

/** Durum takibi: üstte üç parçalı ilerleme çubuğu, altında birbirine çizgiyle bağlı adımlar */
function StepsMock() {
  return (
    <Panel title="Web sitesi projesi" meta="Adım 2 / 3">
      <div className="mb-3 grid grid-cols-3 gap-1" aria-hidden>
        <span className="h-1.5 rounded-full bg-accent" />
        <span className="h-1.5 rounded-full bg-accent/35" />
        <span className="h-1.5 rounded-full bg-[#ECECEC]" />
      </div>
      <ol>
        {STEPS.map((s, i) => (
          <li
            key={s.name}
            className={`relative flex items-center gap-3 rounded-[12px] px-2.5 py-2 ${s.state === "now" ? "bg-[#F6F6F6]" : ""}`}
          >
            {/* Adımları bağlayan dikey çizgi */}
            {i < STEPS.length - 1 && (
              <span
                aria-hidden
                className={`absolute left-[19px] top-[30px] h-[18px] w-0.5 ${s.state === "done" ? "bg-accent" : "bg-[#E5E5E5]"}`}
              />
            )}
            {s.state === "done" ? (
              <Check />
            ) : s.state === "now" ? (
              <span className="grid size-5 shrink-0 place-items-center rounded-full border-2 border-accent">
                <span className="size-2 rounded-full bg-accent" />
              </span>
            ) : (
              <span className="size-5 shrink-0 rounded-full border-2 border-neutral-300" />
            )}
            <span className={s.state === "next" ? "text-neutral-400" : ""}>{s.name}</span>
            <span className="ml-auto">
              <Pill tone={s.state === "now" ? "accent" : "muted"}>{s.status}</Pill>
            </span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}

/** Onay akışı: bekleyen teslim, içerdiği parçalar ve iki karar butonu */
function ApprovalMock() {
  return (
    <Panel title="Onay bekleyen" meta={<Pill tone="accent">1 teslim</Pill>}>
      <div className="flex items-center gap-3">
        {/* Taslağın küçük önizlemesi */}
        <span aria-hidden className="flex h-10 w-12 shrink-0 flex-col gap-1 rounded-[8px] bg-[#F1F1F1] p-1.5">
          <span className="h-1.5 w-full rounded-full bg-accent/60" />
          <span className="h-1 w-3/4 rounded-full bg-neutral-300" />
          <span className="h-1 w-1/2 rounded-full bg-neutral-300" />
        </span>
        <span className="min-w-0 leading-[1.3]">
          <span className="block truncate">Ana sayfa tasarımı hazır</span>
          <span className="block text-[12px] text-neutral-400">3 parça · inceleme için</span>
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5 text-[12.5px]">
        {["Masaüstü", "Mobil", "Metinler"].map((c) => (
          <span key={c} className="flex items-center gap-1.5 rounded-[10px] border border-black/[0.06] bg-[#F8F8F8] py-1.5 pl-1.5 pr-2.5">
            <Check size="sm" />
            {c}
          </span>
        ))}
      </div>
      <div className="mt-3 flex gap-1.5">
        <span className="flex-1 rounded-full border border-black/10 py-2 text-center font-medium text-neutral-600">
          Revize iste
        </span>
        <span className="flex-1 rounded-full bg-accent py-2 text-center font-medium text-accent-ink">Onayla</span>
      </div>
    </Panel>
  );
}

/** Ölçüm kuralı: "Eğer … ise …" iki satır, sağ üstte açık/kapalı anahtarı */
function RuleMock() {
  const key = "w-[46px] shrink-0 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400";
  const chip = "rounded-[10px] bg-[#F1F1F1] px-2.5 py-1.5";
  return (
    <Panel
      title="Bütçe kuralı"
      meta={
        <span className="flex items-center gap-1.5 text-[12px] font-medium text-accent">
          Açık
          <span aria-hidden className="flex h-4 w-7 items-center justify-end rounded-full bg-accent p-0.5">
            <span className="size-3 rounded-full bg-white" />
          </span>
        </span>
      }
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className={key}>Eğer</span>
          <span className={chip}>Tıklama maliyeti</span>
          <span className={`${chip} bg-accent/10 font-medium text-accent`}>₺40 üstü</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={key}>İse</span>
          <span className={chip}>Bütçeyi kaydır</span>
          <span aria-hidden className="text-neutral-400">→</span>
          <span className={`${chip} bg-accent/10 font-medium text-accent`}>Google Ads</span>
        </div>
      </div>
      <p className="mt-3 border-t border-black/[0.06] pt-3 text-[12px] text-neutral-400">Her gün otomatik kontrol edilir</p>
    </Panel>
  );
}

/** Aylık rapor: tek öne çıkan gösterge, küçük çubuk grafik ve bir sonraki adım */
const BARS = [38, 52, 44, 61, 58, 72, 86];

function ReportMock() {
  return (
    <Panel title="Ekim raporu" meta="Son 30 gün">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[13px] text-neutral-500">Siteden gelen talep</p>
          <p className="mt-1 text-[30px] font-medium leading-none tracking-[-0.03em] text-accent">Artışta</p>
        </div>
        <div aria-hidden className="flex h-12 items-end gap-1">
          {BARS.map((h, i) => (
            <span
              key={i}
              className={`w-2 rounded-t-[3px] ${i === BARS.length - 1 ? "bg-accent" : "bg-accent/25"}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2.5 rounded-[12px] bg-[#F6F6F6] px-3 py-2.5">
        <span className="grid size-6 shrink-0 place-items-center rounded-[7px] bg-accent text-accent-ink">
          <MiniGlyph glyph="arrow" cell={2} />
        </span>
        <span className="min-w-0 truncate">
          <span className="text-neutral-500">Sonraki adım:</span> Meta bütçesini artır
        </span>
      </div>
    </Panel>
  );
}

/** Destek: tek mesaj, kısa cevap ve talebin sonuçlandığını gösteren durum satırı */
function ChatMock() {
  return (
    <Panel title="Talep #128" meta={<Pill tone="accent">Çözüldü</Pill>}>
      <div className="flex flex-col gap-2">
        <p className="max-w-[85%] self-end rounded-[16px] rounded-br-[6px] bg-[#F1F1F1] px-3.5 py-2">
          Kampanya sayfasına yeni fiyatı ekleyebilir misiniz?
        </p>
        <div className="flex items-end gap-2">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#111] font-mono text-[9px] font-bold text-white">
            OX
          </span>
          <p className="rounded-[16px] rounded-bl-[6px] bg-accent px-3.5 py-2 text-accent-ink">
            Eklendi, yayında <span aria-hidden>✓</span>
          </p>
        </div>
      </div>
      <p className="mt-2.5 pl-9 font-mono text-[11px] text-neutral-400">Bugün 14:02 · Ekip yanıtladı</p>
    </Panel>
  );
}

const OWNED = [
  { name: "Alan adı", note: "Sahibi: sen" },
  { name: "Tasarım dosyaları", note: "Sende, teslim edildi" },
  { name: "Reklam hesapları", note: "Yönetici: sen" },
];

/** Sahiplik: hangi varlığın kimde olduğu ve erişimin her an görünür olduğu */
function OwnershipMock() {
  return (
    <Panel title="Hesaplar ve dosyalar">
      <ul>
        {OWNED.map((o) => (
          <li key={o.name} className="flex items-center gap-3 border-b border-black/[0.05] py-2 last:border-0">
            <Check />
            <span>{o.name}</span>
            <span className="ml-auto text-[13px] text-neutral-600">{o.note}</span>
          </li>
        ))}
      </ul>
      <p className="mt-1 rounded-[12px] bg-[#F6F6F6] px-3 py-2 text-[12.5px] text-neutral-600">
        Kimin neye eriştiğini her an görürsün.
      </p>
    </Panel>
  );
}

const ROWS = [
  {
    glyph: "browser",
    label: "OX Panel",
    title: "Projenin her adımı görünür.",
    text: "Ne yapıldığını, sırada ne olduğunu ve senden ne beklendiğini her an görürsün. Süreç kapalı kapılar ardında yürümez.",
    tiles: [
      {
        mock: <StepsMock />,
        caption: {
          strong: "Her adımı panelden takip edersin;",
          rest: "hangi iş tamamlandı, hangisi onay bekliyor, hepsi açıkça görünür.",
        },
      },
      {
        mock: <ApprovalMock />,
        caption: { strong: "Taslaklar önce sana gelir;", rest: "sen onaylamadan hiçbir şey yayına alınmaz." },
      },
    ],
  },
  {
    glyph: "bars",
    label: "Ölçüm",
    title: "Kararı veriye göre veririz.",
    text: "Hangi işin işe yaradığını, hangisinin yavaş kaldığını düzenli olarak izleriz. Yorumla değil, veriyle hareket ederiz.",
    tiles: [
      {
        mock: <RuleMock />,
        caption: {
          strong: "Kurallarla izleriz:",
          rest: "performansı düşen kampanyayı fark eder, bütçeyi daha iyi çalışan alana kaydırırız.",
        },
      },
      {
        mock: <ReportMock />,
        caption: { strong: "Her ay sade bir rapor paylaşırız:", rest: "ne harcandı, ne geldi, bir sonraki adım ne." },
      },
    ],
  },
  {
    glyph: "check",
    label: "Teslimden sonra",
    title: "Yayına çıkınca da yanındayız.",
    text: "Bir değişiklik mi lazım, bir sorun mu var? Kime yazacağını düşünmeden tek mesajla bize ulaşırsın.",
    tiles: [
      {
        mock: <ChatMock />,
        caption: {
          strong: "Tek mesajla talebini iletirsin;",
          rest: "işin kimde olduğunu ve ne zaman çözüldüğünü takip etmek bize düşer.",
        },
      },
      {
        mock: <OwnershipMock />,
        caption: { strong: "Dosyalar, hesaplar ve erişimler sende olur.", rest: "İşini kapalı kutuya çevirmeyiz." },
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
