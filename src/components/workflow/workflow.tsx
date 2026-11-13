"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ROLE_AVATARS } from "@/components/about/about-cards";
import { cn } from "@/lib/utils";

// "Nasıl çalışıyoruz": solda sırayla açılan dört madde (üstünde dolan çizgi), sağda krem panelde her maddenin sahnesi.
// Düzen referansı: accretion.framer.ai üçüncü bölüm. Sahneler aynı görev panosuna yaklaşan / uzaklaşan bir kamera gibi:
// pano → tek kart → yakın kart → telefon. Kişi fotoğrafı yok (rol ikonları), rakamlar yalnız görev sayacı.

const STEP_MS = 5200;
const EASE = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  {
    title: "Her şey tek panoda",
    text: "Projelerin, taleplerin ve teslim tarihlerin tek ekranda. Dağınık mesajlar ve kayıp dosyalar yok.",
  },
  {
    title: "Büyük hedef, küçük adımlar",
    text: "İşi net adımlara bölüyoruz; her adımın sahibi ve önceliği belli, tempo düşmüyor.",
  },
  {
    title: "Birlikte, kesintisiz",
    text: "Görevleri paylaşıyor, güncellemeleri anında iletiyoruz; ekibimiz ve sen hep aynı sayfadasınız.",
  },
  {
    title: "Masaüstünde de cepte de",
    text: "Ofiste ya da yolda; projenin durumu her an elinin altında.",
  },
];

export function Workflow() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-120px" });
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  // Tıklayınca sayaç baştan başlasın diye anahtar
  const [tick, setTick] = useState(0);
  const running = inView && !reduced;

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % STEPS.length), STEP_MS);
    return () => clearTimeout(id);
  }, [active, tick, running]);

  const choose = (i: number) => {
    setActive(i);
    setTick((t) => t + 1);
  };

  return (
    <section id="nasil-calisiyoruz" className="bg-background px-4 pb-28 md:px-[4.5vw] md:pb-36">
      <div
        ref={ref}
        className="grid gap-10 rounded-[32px] bg-[#0a0a0b] p-6 text-white md:p-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.4fr)] lg:gap-14 lg:p-12"
      >
        {/* Sol: başlık üstte, maddeler altta */}
        <div className="flex flex-col justify-between gap-12">
          <div>
            <h2 className="text-[clamp(30px,2.9vw,52px)] font-medium leading-[1.08] tracking-[-0.045em]">
              İşin her adımı, tek yerde.
            </h2>
            <p className="mt-5 max-w-[420px] text-[clamp(16px,1.2vw,20px)] leading-[1.45] tracking-[-0.02em] text-white/60">
              Projeni böyle yürütüyoruz: planlı, birlikte ve her cihazdan takip edilebilir.
            </p>
          </div>

          <ol className="border-b border-white/10">
            {STEPS.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.title} className="relative border-t border-white/10">
                  {/* Dolan çizgi: aktif maddenin üst kenarında */}
                  {on && (
                    <motion.span
                      key={`${active}-${tick}`}
                      aria-hidden
                      initial={{ scaleX: reduced ? 1 : 0 }}
                      animate={{ scaleX: running || reduced ? 1 : 0 }}
                      transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                      className="absolute -top-px left-0 h-px w-full origin-left bg-[linear-gradient(90deg,transparent,#2f6bff_30%,#8fb0ff)]"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => choose(i)}
                    aria-expanded={on}
                    className={cn(
                      "w-full py-5 text-left text-[clamp(17px,1.25vw,21px)] tracking-[-0.02em] outline-none transition-colors duration-300 focus-visible:text-white",
                      on ? "font-medium text-white" : "text-white/45 hover:text-white/75",
                    )}
                  >
                    {s.title}
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <span className="block max-w-[440px] pb-6 text-[15px] leading-[1.55] tracking-[-0.01em] text-white/65">{s.text}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Sağ: krem panel ve sahne */}
        <div aria-hidden className="relative aspect-[4/3.4] overflow-hidden rounded-[24px] bg-[#F4F2EC] lg:aspect-auto lg:min-h-[clamp(520px,44vw,780px)]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={active}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.06, filter: "blur(10px)" }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {active === 0 && <BoardScene />}
              {active === 1 && <CardScene />}
              {active === 2 && <CloseScene />}
              {active === 3 && <PhoneScene />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Görev kartı ───────────────────────────── */

type Tone = "plain" | "blue" | "amber" | "pink" | "violet";
const TONES: Record<Tone, string> = {
  plain: "bg-white/[0.07] text-white/70",
  blue: "bg-[#2f6bff]/15 text-[#8fb0ff]",
  amber: "bg-[#FACC15]/12 text-[#E8B923]",
  pink: "bg-[#F472B6]/15 text-[#F472B6]",
  violet: "bg-[#A78BFA]/15 text-[#B9A2FF]",
};

type Task = { title: string; tags: [string, Tone][]; docs: number; files?: number; comments?: number; people?: number };

const TASKS: Record<string, Task> = {
  home: { title: "Ana sayfa tasarımı", tags: [["#OX007", "plain"], ["Tasarım", "blue"], ["Bekliyor", "amber"]], docs: 4, files: 2, comments: 3, people: 2 },
  launch: { title: "Lansman duyurusunu yaz", tags: [["#OX003", "plain"], ["İçerik", "pink"], ["Bekliyor", "amber"]], docs: 1, files: 2, comments: 4, people: 2 },
  dark: { title: "Menüye koyu tema ekle", tags: [["#OX005", "plain"], ["Yapılacak", "pink"]], docs: 1, files: 2, comments: 4, people: 2 },
  form: { title: "Talep formunu test et", tags: [["#OX008", "plain"], ["Yapılacak", "pink"]], docs: 0 },
  seo: { title: "Arama sonuçlarını iyileştir", tags: [["#OX002", "plain"], ["Sürüyor", "violet"]], docs: 1, files: 2, comments: 4, people: 2 },
  ads: { title: "Kampanya görselleri", tags: [["#OX011", "plain"], ["Reklam", "blue"], ["Bekliyor", "amber"]], docs: 2, files: 2, comments: 1, people: 1 },
  review: { title: "Müşteri yorumlarını incele ve tekrar edenleri bul", tags: [["#BC05", "plain"], ["Bekliyor", "amber"], ["Proje", "plain"]], docs: 2, files: 2 },
};

function Glyph({ d, className }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d={d} />
    </svg>
  );
}
const DOC = "M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm4.6 15.4 5.6-5.6-1.4-1.4-4.2 4.2-1.8-1.8-1.4 1.4Z";
const CLIP = "M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm6 6.5a2.5 2.5 0 0 0-2.5 2.5v4a1 1 0 0 0 2 0v-4a.5.5 0 0 1 1 0v4.5a2.5 2.5 0 0 1-5 0V11H6v4.5a4.5 4.5 0 0 0 9 0V11A2.5 2.5 0 0 0 12 8.5Z";
const CHAT = "M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8l-4 4V5a2 2 0 0 1 2-2Zm3 5v2h10V8Zm0 4v2h7v-2Z";

function Avatars({ n, size = 26, ring = "#141416" }: { n: number; size?: number; ring?: string }) {
  return (
    <span className="flex items-center">
      {ROLE_AVATARS.slice(0, n).map((a, i) => (
        <span
          key={i}
          className="-ml-1.5 grid place-items-center rounded-full first:ml-0"
          style={{ width: size, height: size, backgroundColor: a.bg, boxShadow: `0 0 0 2px ${ring}` }}
        >
          <svg viewBox="0 0 24 24" style={{ width: size * 0.5, height: size * 0.5 }} fill="none" stroke={a.fg} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d={a.d} />
          </svg>
        </span>
      ))}
      {n > 0 && (
        <span
          className="-ml-1.5 grid place-items-center rounded-full bg-[#2a2a2e] text-white/80"
          style={{ width: size, height: size, fontSize: size * 0.38, boxShadow: `0 0 0 2px ${ring}` }}
        >
          +3
        </span>
      )}
      <span
        className="ml-2 grid place-items-center rounded-full border border-dashed border-white/25 text-white/50"
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 24 24" style={{ width: size * 0.55, height: size * 0.55 }} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      </span>
    </span>
  );
}

function TaskCard({ task, className, big }: { task: Task; className?: string; big?: boolean }) {
  return (
    <div className={cn("rounded-[14px] bg-[#141416] text-white", big ? "rounded-[36px] p-[6%]" : "p-3.5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className={cn("font-medium tracking-[-0.02em]", big ? "text-[clamp(20px,2.2vw,38px)] leading-[1.15] text-white/90" : "text-[12.5px] leading-[1.35]")}>
          {task.title}
        </p>
        {task.docs > 0 && (
          <span className={cn("flex shrink-0 items-center gap-1.5", big ? "text-[clamp(14px,1.4vw,24px)] text-white/60" : "text-[10px] text-[#5fb8ff]")}>
            <Glyph d={DOC} className={big ? "size-[clamp(22px,2.4vw,40px)] text-white" : "size-[14px] text-[#5fb8ff]"} />
            {task.docs}
          </span>
        )}
      </div>
      <div className={cn("flex flex-wrap", big ? "mt-[5%] gap-3" : "mt-2.5 gap-1.5")}>
        {task.tags.map(([label, tone]) => (
          <span key={label} className={cn("rounded-full", TONES[tone], big ? "px-[1em] py-[0.45em] text-[clamp(12px,1.25vw,22px)]" : "px-2 py-[3px] text-[9px]")}>
            {label}
          </span>
        ))}
      </div>
      {(task.people || task.files || task.comments) && (
        <div className={cn("flex items-center justify-between", big ? "mt-[6%]" : "mt-3")}>
          {big ? (
            <span className="grid size-[clamp(36px,4vw,60px)] place-items-center rounded-full border-2 border-dashed border-white/25 text-white/80">
              <svg viewBox="0 0 24 24" className="size-1/2" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v8M8 12h8" />
              </svg>
            </span>
          ) : (
            <Avatars n={task.people ?? 0} size={22} />
          )}
          <span className={cn("flex items-center", big ? "gap-3 text-[clamp(14px,1.4vw,24px)] text-white/60" : "gap-2 text-[9.5px]")}>
            {task.files ? (
              <span className={cn("flex items-center gap-1", !big && "text-[#B48CFF]")}>
                <Glyph d={CLIP} className={big ? "size-[clamp(22px,2.4vw,40px)] text-white" : "size-[14px]"} />
                {task.files}
              </span>
            ) : null}
            {task.comments && !big ? (
              <span className="flex items-center gap-1 text-[#F5B83D]">
                <Glyph d={CHAT} className="size-[14px]" />
                {task.comments}
              </span>
            ) : null}
          </span>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────────── Sahneler ───────────────────────────── */

function Column({ title, count, dot, tasks, className }: { title: string; count: number; dot: string; tasks: Task[]; className?: string }) {
  return (
    <div className={cn("flex w-[230px] shrink-0 flex-col gap-2.5", className)}>
      <div className="flex items-center justify-between px-1 pb-2">
        <span className="flex items-center gap-2 text-[12.5px] font-medium text-white/85">
          {title}
          <span className="grid size-[17px] place-items-center rounded-full text-[9px]" style={{ backgroundColor: `${dot}26`, color: dot }}>
            {count}
          </span>
        </span>
        <span className="tracking-[2px] text-white/40">•••</span>
      </div>
      {tasks.map((t, i) => (
        <TaskCard key={i} task={t} />
      ))}
    </div>
  );
}

/** 1: Pano görünümü (panelin solunda krem şerit kalır, sağa ve alta taşar) */
function BoardScene() {
  return (
    <div className="absolute bottom-[-8%] left-[6%] right-[-30%] top-0 overflow-hidden rounded-tl-[18px] bg-[#0d0d0f] p-5">
      <div className="flex items-center gap-3 text-[11.5px] text-white/60">
        <span className="flex overflow-hidden rounded-[10px] border border-white/10">
          <span className="flex items-center gap-1.5 border-r border-white/10 px-3 py-2 text-white">▦ Pano</span>
          <span className="flex items-center gap-1.5 px-3 py-2">☰ Liste</span>
        </span>
        <span className="px-2">Sınırlı erişim ⌄</span>
        <span className="flex items-center gap-2 px-2">
          Sahip
          <span className="size-[18px] rounded-full bg-accent" />
          <span className="text-white/85">OX Ekip</span>
        </span>
        <span className="ml-auto rounded-[10px] border border-white/10 px-3 py-2 text-white/40">⌕ Görev ara</span>
      </div>
      <div className="mt-6 flex gap-3">
        <Column title="Bekleyenler" count={5} dot="#E8B923" tasks={[TASKS.launch, TASKS.home, TASKS.ads]} />
        <Column title="Yapılacaklar" count={3} dot="#F472B6" tasks={[TASKS.dark, TASKS.form, TASKS.review]} />
        <Column title="Sürenler" count={2} dot="#B9A2FF" tasks={[TASKS.seo, TASKS.seo]} />
      </div>
    </div>
  );
}

/** 2: Tek kart, altında deste */
function CardScene() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative w-[min(52%,380px)]">
        <div className="absolute inset-x-[3%] -bottom-[22%] h-full rounded-[14px] bg-[#141416] opacity-90" />
        <div className="absolute inset-x-[1.5%] -bottom-[11%] h-full rounded-[14px] bg-[#18181a] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]" />
        <TaskCard task={TASKS.home} className="relative shadow-[0_24px_50px_-20px_rgba(0,0,0,0.6)]" />
      </div>
    </div>
  );
}

/** 3: Yakın plan kart */
function CloseScene() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <TaskCard task={TASKS.review} big className="w-[84%]" />
    </div>
  );
}

/** 4: Telefon */
function PhoneScene() {
  const TABS = ["Zaman çizelgesi", "Takvim", "Pano", "İlerleme"];
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative flex h-[86%] items-center">
        <span className="mr-[clamp(18px,3vw,40px)] h-[12%] w-[5px] rounded-full bg-black/15" />
        <div className="relative aspect-[9/16.2] h-full overflow-hidden rounded-[clamp(28px,3vw,44px)] bg-[#0d0d0f] px-[5%] pt-[4%] text-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between px-[6%] text-[11px] font-semibold">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="h-[7px] w-[14px] rounded-[2px] bg-white" />
            </span>
          </div>
          <p className="mt-[8%] flex items-center gap-2 text-[16px] font-medium tracking-[-0.02em]">Görev panoları ✎</p>
          <div className="mt-[5%] flex gap-3 overflow-hidden whitespace-nowrap text-[8.5px] text-white/50">
            {TABS.map((t, i) => (
              <span key={t} className={cn("pb-1", i === 0 && "border-b border-accent text-accent")}>
                {t}
              </span>
            ))}
          </div>
          <div className="mt-[6%] flex origin-top-left scale-[0.78] gap-2.5" style={{ width: "128%" }}>
            <Column title="Bekleyenler" count={5} dot="#E8B923" tasks={[TASKS.home, TASKS.launch, TASKS.ads]} className="w-[200px]" />
            <Column title="Yapılacaklar" count={3} dot="#F472B6" tasks={[TASKS.dark, TASKS.form]} className="w-[200px]" />
          </div>
        </div>
        <span className="ml-[clamp(18px,3vw,40px)] h-[12%] w-[5px] rounded-full bg-black/15" />
      </div>
    </div>
  );
}
