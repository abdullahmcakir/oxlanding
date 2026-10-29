# Görev: "Paket" detay flyout'unu bu landing sitesine taşı

Bu tasarım OX Dijital'in müşteri panelinden (ayrı repo, Next.js + Tailwind +
shadcn) geliyor. Aynı görünümü ve davranışı bu landing sitesinde kurmanı
istiyorum. Aşağıda panelde çalışan referans kod var. **Kopyala-yapıştır yapma;
önce bu projenin yığınına bak** (framework, Tailwind var mı, shadcn/ui var mı,
Radix kurulu mu, ikon kütüphanesi ne) ve kodu ona uyarla. Görsel sonuç birebir
aynı olmalı.

## Ne yapıyor

- Sayfada 3 paket kartı var (Sıfırdan Başla · Satışa Geç · Ölçekle). Karta
  tıklayınca **sağdan 560px'lik koyu bir panel** açılıyor (mobilde tam genişlik).
- Panel: üstte görsel + "Paket · N kalem" amber rozeti + başlık; altında
  açıklama, **kalemler tipine göre gruplu** (Hizmetler / Otomasyonlar /
  Uygulamalar, her grubun kendi rengi ve bir satırlık açıklaması), "Fiyat
  kapsama göre belirleniyor" kutusu, "Sonra ne oluyor?" adımları.
- **CTA altta sabit** ("Paketi Konuşalım"): liste uzayınca kaydırmanın altında
  kaybolmasın diye kaydırılan alanın dışında.
- CTA'ya basınca detay paneli **kapanıyor**, yerine Cal.com takvim paneli
  açılıyor. İki panel üst üste binmiyor (bilinçli: kapatma sırası belirsizleşir).
- ESC, arka plana tıklama, focus trap, scroll kilidi çalışmalı (Radix Dialog
  bunları hazır veriyor).

## Bilerek böyle olan tasarım kararları (değiştirme)

- **Koyu zemin + amber ışıma.** Panelde öteki ürünlerin flyout'ları beyaz;
  paket onların toplamı, en ağır satış kalemi. Beyaz durunca "bir tane daha"
  gibi okunuyordu.
- **Kalem satırlarında ikon, "dahil" rozeti, iç içe kart YOK.** Bölüm zaten
  "pakette neler var"ı anlatıyor; her satırda tekrar etmek gürültüydü. Tek
  vurgu: grubun rengindeki ince dikey çubuk.
- **Fiyat yok, ama bunu söyleyen kutu var.** Söylenmeyince "fiyat gizleniyor"
  hissi veriyordu.
- **CTA altında "Görüşme ~30 dakika · bağlayıcı değil"** notu: düğmeye
  basmanın maliyetini düşürüyor.
- Harf aralıkları: büyük başlıklarda `-0.03em`, font-weight light (300).
- Kart görselinin kapsayıcısında `overflow-hidden` şart: hover'da görsel
  %105'e büyüyor ve kırpılmazsa karartma katmanının dışına taşıyor.

## Landing için yapılacak uyarlamalar

1. **Ad/e-posta ön-dolgusu yok.** Panelde oturum açmış kullanıcının bilgisi
   Cal iframe'ine `name` / `email` parametresi olarak geçiliyordu. Landing'de
   ziyaretçi anonim; bu parametreleri çıkar (prop'lar opsiyonel kalabilir).
2. **"Sonra ne oluyor?" adımları panel varsayıyor** ("ödeme talebi
   panelinize gelir"). Landing ziyaretçisinin henüz paneli yok. Aşağıdaki
   koddaki landing metnini kullan; değiştirmen gerekirse bana sor.
3. **Cal adresi env'den gelsin:** `CAL_ORIGIN` (ör. `https://meet.ox-software.com`)
   ve `CAL_LINK` (event yolu, ör. `ekip/paket-gorusmesi`). Bu projenin env
   adlandırma kuralına uy (Next.js ise `NEXT_PUBLIC_` öneki gerekir, Vite ise
   `VITE_`). `CAL_LINK` boşsa takvim paneli "henüz yapılandırılmadı" mesajı
   gösteriyor; bu davranış kalsın.
4. **Görseller** şu an Unsplash URL'leri. Projede `next/image` veya görsel
   optimizasyonu kullanılıyorsa ona geç ve Unsplash host'unu izinli listeye
   ekle; yoksa `<img>` kalabilir.
5. **Paket verisi** tek bir sabit dizide (`BUNDLES`). Landing'de içerik
   CMS/MDX'ten geliyorsa oraya taşı; gelmiyorsa ayrı bir `bundles.ts` dosyası
   yeterli.
6. Dil Türkçe. Metinleri değiştirme.

## Bağımlılıklar

- `@radix-ui/react-dialog` (shadcn/ui varsa onun `Sheet` bileşenini kullan,
  aynı şey). Radix yoksa kur; panel davranışını elle yazma.
- `lucide-react` (`ArrowUpRight`, `CalendarPlus`, `X`). Başka bir ikon seti
  varsa eşdeğerini kullan.
- Tailwind. Tailwind yoksa sınıfları bu projenin stil yöntemine çevir;
  renkler ve ölçüler zaten çoğunlukla inline `style` içinde.
- Açılma/kapanma animasyonu için kodda küçük bir CSS bloğu var
  (`tailwindcss-animate` gerektirmesin diye). Projede bu eklenti/shadcn varsa
  onun `slide-in-from-right` sınıflarını kullan, CSS bloğunu silebilirsin.

## Bitince kontrol et

- Üç kartı da aç: 5, 4 ve 5 kalem; gruplar sırasıyla Hizmetler → Otomasyonlar
  → Uygulamalar. "Ölçekle" üç grubu da gösterir.
- Mobil genişlikte (375px) panel tam ekran, CTA görünür, sayfa yatay kaymıyor.
- "Paketi Konuşalım" → detay kapanıp takvim açılıyor; ESC ikisini de kapatıyor.
- Klavyeyle: kart Tab ile odaklanıp Enter ile açılıyor, panel kapanınca odak
  karta dönüyor.

---

## Referans kod

Tek dosyada toplandı: veri + kart + paket paneli + Cal paneli. İstersen
bölebilirsin.

```tsx
'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ArrowUpRight, CalendarPlus, X } from 'lucide-react'

/* ─────────────────────────── Veri ─────────────────────────── */

type ItemKind = 'hizmet' | 'modül' | 'uygulama'

export interface Bundle {
  slug: string
  title: string
  tagline: string
  description: string
  image: string
  items: { label: string; kind: ItemKind }[]
}

const shot = (id: string) =>
  `https://images.unsplash.com/${id}?w=1200&h=800&fit=crop&auto=format&q=80`

export const BUNDLES: Bundle[] = [
  {
    slug: 'sifirdan-basla',
    title: 'Sıfırdan Başla',
    tagline: 'Yeni işletmeler için',
    description:
      'Dijitalde hiç yoksan: markanı kur, siteni aç, arama ve sosyalde görünür ol.',
    image: shot('photo-1517245386807-bb43f82c33c4'),
    items: [
      { label: 'Branding', kind: 'hizmet' },
      { label: 'Tanıtım Sitesi', kind: 'hizmet' },
      { label: 'SEO & İçerik', kind: 'hizmet' },
      { label: 'Sosyal Medya Yönetimi', kind: 'hizmet' },
      { label: 'Sosyal Medya Otomasyonu', kind: 'modül' },
    ],
  },
  {
    slug: 'satisa-gec',
    title: 'Satışa Geç',
    tagline: 'Gelir kanalı kuranlar için',
    description:
      'Online satışa başla, gelen müşteriyi takip et, iletişimi otomatiğe bağla.',
    image: shot('photo-1551434678-e076c223a692'),
    items: [
      { label: 'E-ticaret Sitesi', kind: 'hizmet' },
      { label: 'Mekanda', kind: 'hizmet' },
      { label: 'Müşteri Takip Otomasyonu', kind: 'modül' },
      { label: 'WhatsApp Bildirim Botu', kind: 'modül' },
    ],
  },
  {
    slug: 'olcekle',
    title: 'Ölçekle',
    tagline: 'Büyüyen ekipler için',
    description:
      'Tekrar eden işleri otomatiğe al, raporlarını topla, kendi araçlarını çalıştır.',
    image: shot('photo-1531403009284-440f080d1e12'),
    items: [
      { label: 'Otomasyon', kind: 'hizmet' },
      { label: 'Fatura Otomasyon', kind: 'modül' },
      { label: 'Rapor & Analitik', kind: 'modül' },
      { label: 'n8n', kind: 'uygulama' },
      { label: 'Nextcloud', kind: 'uygulama' },
    ],
  },
]

/** Kalem tipinin müşteriye ne ifade ettiği. */
const KIND_META: Record<ItemKind, { label: string; blurb: string; color: string }> = {
  hizmet: {
    label: 'Hizmetler',
    blurb: 'Ekibimizin sizin için ürettiği işler',
    color: '#fde68a',
  },
  modül: {
    label: 'Otomasyonlar',
    blurb: 'Kurulup arka planda çalışan modüller',
    color: '#bbf7d0',
  },
  uygulama: {
    label: 'Uygulamalar',
    blurb: 'Sizin adınıza kurulan yazılımlar',
    color: '#a5b4fc',
  },
}

const KIND_ORDER: ItemKind[] = ['hizmet', 'modül', 'uygulama']

/** Landing sürümü: ziyaretçinin henüz paneli yok. */
const NEXT_STEPS = [
  'Uygun bir saat seçersiniz, ekibimiz sizi arar.',
  'Görüşmede paketi ihtiyacınıza göre birlikte şekillendiririz.',
  'Kapsam netleşince size bir teklif ve müşteri paneli erişimi gönderiyoruz.',
  'Ödeme sonrası kalemler tek tek açılır, ilerlemeyi panelden takip edersiniz.',
]

/* ─────────────────────── Ortak panel kabuğu ─────────────────────── */

/**
 * Sağdan açılan panel. Radix Dialog: ESC, overlay tıklaması, focus trap ve
 * scroll kilidi hazır. shadcn/ui varsa bunun yerine `Sheet` kullan.
 */
function SidePanel({
  open,
  onOpenChange,
  title,
  className = '',
  style,
  closeClassName = 'text-white/70 hover:text-white',
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  className?: string
  style?: React.CSSProperties
  closeClassName?: string
  children: React.ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="ox-overlay fixed inset-0 z-50 bg-black/80" />
        <Dialog.Content
          aria-describedby={undefined}
          className={`ox-panel fixed inset-y-0 right-0 z-50 h-full w-full flex flex-col overflow-hidden shadow-lg focus:outline-none ${className}`}
          style={style}
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <Dialog.Close
            className={`absolute right-4 top-4 z-10 rounded-sm transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${closeClassName}`}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Kapat</span>
          </Dialog.Close>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

/* ─────────────────────────── Paket kartı ─────────────────────────── */

export function BundleCard({
  bundle,
  calOrigin,
  calLink,
}: {
  bundle: Bundle
  calOrigin: string
  calLink: string
}) {
  const [open, setOpen] = useState(false)
  const [calOpen, setCalOpen] = useState(false)

  const groups = KIND_ORDER.map((kind) => ({
    kind,
    meta: KIND_META[kind],
    list: bundle.items.filter((i) => i.kind === kind),
  })).filter((g) => g.list.length > 0)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group bg-white rounded-3xl overflow-hidden flex flex-col text-left h-full transition-transform hover:scale-[1.01]"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}
      >
        {/* overflow-hidden ŞART: hover'da görsel %105'e büyüyor. */}
        <div className="relative h-[150px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bundle.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(8,8,8,0.92) 6%, rgba(8,8,8,0.3) 60%, rgba(8,8,8,0.5) 100%)',
            }}
          />
          <div className="absolute bottom-4 left-5 right-5">
            <p className="text-[10px] uppercase font-semibold text-white/70">
              {bundle.tagline}
            </p>
            <h3
              className="text-[22px] font-light leading-none mt-1.5 text-white"
              style={{ letterSpacing: '-0.03em' }}
            >
              {bundle.title}
            </h3>
          </div>
        </div>

        {/* Kartta yalnız özet; tam liste panelde. */}
        <div className="p-5 flex-1 flex flex-col">
          <p className="text-[12.5px] text-zinc-500 leading-relaxed line-clamp-3">
            {bundle.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {bundle.items.slice(0, 3).map((item) => (
              <span
                key={item.label}
                className="text-[10.5px] px-2 py-1 rounded-full bg-zinc-100 text-zinc-600"
              >
                {item.label}
              </span>
            ))}
            {bundle.items.length > 3 && (
              <span className="text-[10.5px] px-2 py-1 rounded-full bg-zinc-100 text-zinc-500">
                +{bundle.items.length - 3}
              </span>
            )}
          </div>

          <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-zinc-900">
            Paketi incele
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
        </div>
      </button>

      {/* ── Detay paneli — KOYU ── */}
      <SidePanel
        open={open}
        onOpenChange={setOpen}
        title={bundle.title}
        className="sm:max-w-[560px] text-white"
        style={{
          background: `
            radial-gradient(at 10% 0%, rgba(253, 230, 138, 0.22) 0%, transparent 45%),
            radial-gradient(at 90% 8%, rgba(120, 53, 15, 0.55) 0%, transparent 50%),
            radial-gradient(at 50% 104%, rgba(253, 230, 138, 0.14) 0%, transparent 55%),
            linear-gradient(160deg, #14110d 0%, #0c0a08 60%, #060505 100%)
          `,
        }}
      >
        {/* Hero */}
        <div className="relative w-full h-52 flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bundle.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(12,10,8,0.75) 55%, #0c0a08 100%)',
            }}
          />
          <div className="absolute inset-x-0 bottom-0 p-6">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
              style={{ background: '#fde68a', color: '#78350f' }}
            >
              Paket · {bundle.items.length} kalem
            </span>
            <h2
              className="text-white text-[30px] font-light leading-tight mt-2.5"
              style={{ letterSpacing: '-0.03em' }}
            >
              {bundle.title}
            </h2>
            <p className="text-[12.5px] text-white/60 mt-1">{bundle.tagline}</p>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-4">
          <p className="text-[14px] text-white/75 leading-relaxed">
            {bundle.description}
          </p>

          {/* KAPSAM — tipine göre gruplu. Satırlarda ikon / "dahil" rozeti
              bilerek yok; tek vurgu grubun rengi. */}
          {groups.map((g) => (
            <div key={g.kind} className="pt-1">
              <div className="flex items-baseline gap-2">
                <span
                  className="text-[11px] uppercase font-semibold"
                  style={{ color: g.meta.color }}
                >
                  {g.meta.label}
                </span>
                <span className="text-[11px] text-white/35">
                  {g.list.length} kalem
                </span>
              </div>
              <p className="text-[11.5px] text-white/40 mt-1 leading-snug">
                {g.meta.blurb}
              </p>

              <div
                className="mt-3 rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.045)',
                  border: '0.5px solid rgba(255,255,255,0.09)',
                }}
              >
                {g.list.map((item, i) => (
                  <div
                    key={item.label}
                    className="px-4 py-3.5 flex items-center gap-3"
                    style={{
                      borderTop:
                        i === 0 ? 'none' : '0.5px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <span
                      className="w-1 h-4 rounded-full flex-shrink-0"
                      style={{ background: g.meta.color, opacity: 0.7 }}
                    />
                    <span className="text-[14.5px] text-white leading-snug">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Fiyat neden yok — söylenmezse "gizleniyor" hissi veriyor. */}
          <div
            className="rounded-3xl p-5"
            style={{
              background: 'rgba(253,230,138,0.08)',
              border: '0.5px solid rgba(253,230,138,0.22)',
            }}
          >
            <p className="text-[13px] font-semibold" style={{ color: '#fde68a' }}>
              Fiyat kapsama göre belirleniyor
            </p>
            <p className="text-[12.5px] text-white/65 mt-1.5 leading-relaxed">
              Paket sabit değil: kalemlerin bir kısmını çıkarabilir,
              başkalarını ekleyebilirsiniz. Görüşmede ihtiyacınıza göre
              netleştirip size teklif gönderiyoruz.
            </p>
          </div>

          <div className="px-1">
            <p className="text-[10px] uppercase text-white/40 font-medium mb-3">
              Sonra ne oluyor?
            </p>
            <ol className="space-y-2.5">
              {NEXT_STEPS.map((t, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 mt-0.5"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-[12.5px] text-white/60 leading-snug">
                    {t}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* CTA altta sabit: liste uzadıkça kaybolmasın. */}
        <div
          className="px-6 pb-6 pt-4 flex-shrink-0"
          style={{
            background: 'rgba(0,0,0,0.35)',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <button
            type="button"
            onClick={() => {
              // İki panel üst üste açılmaz: önce detay kapanır.
              setOpen(false)
              setCalOpen(true)
            }}
            className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-full text-[13.5px] font-semibold transition-transform hover:scale-[1.02]"
            style={{
              background: '#fde68a',
              color: '#78350f',
              boxShadow: '0 6px 20px rgba(253,230,138,0.25)',
            }}
          >
            <CalendarPlus className="h-4 w-4" strokeWidth={1.9} />
            Paketi Konuşalım
          </button>
          <p className="text-[11px] text-white/40 text-center mt-2.5">
            Görüşme ~30 dakika · bağlayıcı değil
          </p>
        </div>
      </SidePanel>

      <CalBookingPanel
        open={calOpen}
        onOpenChange={setCalOpen}
        calOrigin={calOrigin}
        calLink={calLink}
      />
    </>
  )
}

/* ─────────────────────────── Cal paneli ─────────────────────────── */

/**
 * Cal.com embed'i sağdan açılan beyaz panelde. Ay görünümü dar panelde
 * sıkıştığı için 680px.
 */
export function CalBookingPanel({
  open,
  onOpenChange,
  calOrigin,
  calLink,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  calOrigin: string
  calLink: string
}) {
  const src = calLink
    ? `${calOrigin.replace(/\/+$/, '')}/${calLink.replace(/^\/+/, '')}?${new URLSearchParams({
        embed: 'true',
        theme: 'light',
        layout: 'month_view',
      })}`
    : ''

  return (
    <SidePanel
      open={open}
      onOpenChange={onOpenChange}
      title="Uygun bir saat seçin"
      className="sm:max-w-[680px] bg-white"
      closeClassName="text-zinc-500 hover:text-zinc-900"
    >
      <div className="px-6 pt-6 pb-4 text-left">
        <p className="text-[10px] uppercase tracking-[0.04em] text-zinc-500 font-medium">
          Ön Görüşme
        </p>
        <h2
          className="text-[22px] font-light text-zinc-900 leading-tight mt-1"
          style={{ letterSpacing: '-0.025em' }}
        >
          Uygun bir saat seçin
        </h2>
      </div>

      {src ? (
        <div className="flex-1 min-h-0 px-6 pb-6">
          <iframe
            src={src}
            title="Ön görüşme planla"
            className="w-full h-full rounded-2xl"
            style={{ border: '1px solid #e4e4e7' }}
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-6 text-center">
          <p className="text-[14px] font-medium text-zinc-700">
            Görüşme planlama henüz yapılandırılmadı.
          </p>
          <p className="text-[12px] text-zinc-400 mt-1.5">
            Cal.com bağlantısı ayarlandığında burada takvim görünecek.
          </p>
        </div>
      )}
    </SidePanel>
  )
}

/* ─────────────────────────── Kullanım ─────────────────────────── */

export function BundlesSection() {
  const calOrigin = process.env.NEXT_PUBLIC_CAL_ORIGIN ?? 'https://meet.ox-software.com'
  const calLink = process.env.NEXT_PUBLIC_CAL_LINK ?? ''

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {BUNDLES.map((b) => (
        <BundleCard key={b.slug} bundle={b} calOrigin={calOrigin} calLink={calLink} />
      ))}
    </div>
  )
}
```

### Animasyon CSS'i (global stil dosyasına)

shadcn / `tailwindcss-animate` varsa buna gerek yok.

```css
@keyframes ox-slide-in { from { transform: translateX(100%) } to { transform: translateX(0) } }
@keyframes ox-slide-out { from { transform: translateX(0) } to { transform: translateX(100%) } }
@keyframes ox-fade-in { from { opacity: 0 } to { opacity: 1 } }
@keyframes ox-fade-out { from { opacity: 1 } to { opacity: 0 } }

.ox-panel[data-state='open'] { animation: ox-slide-in 500ms ease-in-out }
.ox-panel[data-state='closed'] { animation: ox-slide-out 300ms ease-in-out }
.ox-overlay[data-state='open'] { animation: ox-fade-in 300ms ease-out }
.ox-overlay[data-state='closed'] { animation: ox-fade-out 300ms ease-in }

@media (prefers-reduced-motion: reduce) {
  .ox-panel, .ox-overlay { animation: none !important }
}
```
