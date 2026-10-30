import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/about/about-cards";
import { Badge } from "@/components/feed/feed-badge";
import { SplitHeading } from "@/components/ui/section-parts";
import { Block } from "./article-blocks";
import { relatedArticles, type Article } from "./article-data";
import { ArticleShare } from "./article-share";

// Referans: clean-tuna-722417.framer.app/blogayrı. Akış:
// büyük başlık + geniş görsel → büyük puntolu giriş → "Kısaca" + içindekiler → numaralı bölümler
// (bloklarla çeşitlenen gövde) → yazar + paylaş → diğer yazılar.
// Okuma ilerlemesini sağ alttaki asistan gösterir: `data-article` / `data-article-section` işaretleri (dock.tsx).

const META = "font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500";

export function ArticlePage({ article }: { article: Article }) {
  const related = relatedArticles(article.slug);

  return (
    <div className="bg-background px-4 pb-28 pt-[132px] md:px-[4.5vw] md:pb-36 md:pt-[150px]">
      <header className="mx-auto max-w-[1120px]">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Badge kind="blog" />
          <p className={META}>
            {article.category} · {article.date} · {article.minutes} dk okuma
          </p>
        </div>
        <h1 className="mt-6 max-w-[15em] text-[clamp(40px,4.6vw,72px)] font-medium leading-[1.04] tracking-[-0.045em] text-[#111]">
          {article.title}
        </h1>
        <Reveal className="relative mt-12 aspect-[16/9] overflow-hidden rounded-[28px] bg-[#F1F1F1] md:aspect-[16/7]">
          <Image src={article.image} alt="" fill preload sizes="(min-width: 1200px) 1120px, 100vw" className="object-cover" />
        </Reveal>
      </header>

      <div className="mx-auto mt-16 max-w-[720px] space-y-6 md:mt-24">
        {article.lede.map((p) => (
          <p key={p.slice(0, 24)} className="text-[clamp(21px,1.65vw,27px)] leading-[1.35] tracking-[-0.02em] text-[#111]">
            {p}
          </p>
        ))}
      </div>

      {/* Acelesi olan özü alır; olmayan neyle karşılaşacağını bilerek devam eder */}
      <div className="mx-auto mt-14 grid max-w-[960px] gap-3 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <Reveal className="rounded-[28px] bg-accent p-7 text-black md:p-8">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-black/60">Kısaca</p>
          <ol className="mt-5 space-y-4">
            {article.takeaways.map((t, i) => (
              <li key={t} className="flex gap-3 text-[17px] leading-[1.35] tracking-[-0.015em]">
                <span className="pt-[3px] font-mono text-[11px] text-black/50">0{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>
        </Reveal>
        <Reveal index={1} className="rounded-[28px] bg-[#F1F1F1] p-7 md:p-8">
          <p className={META}>İçindekiler</p>
          <ol className="mt-4">
            {article.sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="group flex items-baseline gap-3 border-b border-black/[0.06] py-2.5 text-[16px] tracking-[-0.01em] text-[#111] last:border-0"
                >
                  <span className="font-mono text-[11px] text-neutral-400">0{i + 1}</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>

      <article data-article className="mx-auto mt-20 max-w-[720px] md:mt-28">
        {article.sections.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            data-article-section
            data-title={s.title}
            className="scroll-mt-28 pt-16 first:pt-0 md:pt-20"
          >
            <p className="font-mono text-[12px] font-bold text-neutral-400">0{i + 1}</p>
            <h2 className="mt-3 text-[clamp(28px,2.6vw,42px)] font-medium leading-[1.1] tracking-[-0.04em] text-[#111]">
              {s.title}
            </h2>
            <div className="mt-7 space-y-6">
              {s.blocks.map((b, j) => (
                <Block key={j} block={b} />
              ))}
            </div>
          </section>
        ))}
      </article>

      {/* Referanstaki kişi kartlarının karşılığı: yazarı tanıt, paylaşmayı kolaylaştır */}
      <Reveal className="mx-auto mt-24 max-w-[720px]">
        <div className="flex flex-col gap-6 rounded-[28px] bg-[#F1F1F1] p-6 md:p-8">
          <div className="flex items-start gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#111] text-[18px] font-medium text-accent">
              {article.author.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)}
            </span>
            <div>
              <p className={META}>Yazan</p>
              <p className="mt-1 text-[18px] font-medium tracking-[-0.02em] text-[#111]">{article.author.name}</p>
              <p className="text-[14px] text-neutral-500">{article.author.role}</p>
              <p className="mt-3 max-w-[48ch] text-[15px] leading-[1.5] text-[#333]">{article.author.bio}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-5">
            <p className="text-[15px] tracking-[-0.01em] text-[#111]">Faydalı bulduysan paylaş.</p>
            <ArticleShare title={article.title} />
          </div>
        </div>
      </Reveal>

      <section className="mx-auto mt-28 max-w-[1200px] md:mt-36">
        <SplitHeading strong="Diğer yazılar." soft="Okumaya devam et." />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {related.map((a, i) => (
            <Reveal key={a.slug} index={i}>
              <Link href={`/blog/${a.slug}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-[#F1F1F1]">
                  <Image
                    src={a.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 400px, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <Badge kind="blog" className="absolute left-3 top-3" />
                </div>
                <p className={`${META} mt-4`}>
                  {a.category} · {a.minutes} dk
                </p>
                <p className="mt-2 text-[20px] font-medium leading-[1.2] tracking-[-0.025em] text-[#111] underline-offset-4 group-hover:underline">
                  {a.title}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
