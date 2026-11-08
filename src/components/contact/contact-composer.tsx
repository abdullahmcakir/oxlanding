"use client";

import { useId, useState } from "react";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { track } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/links";
import { cn } from "@/lib/utils";

// Referanstaki form kutusu. Ayrı bir gelen kutusu açmamak için mesaj gönderilmez, WhatsApp'ta hazır yazılmış
// olarak açılır (tek gelen kutusu: WhatsApp, oradan OX Panel'e). Ziyaretçi form doldurmuş gibi hisseder.
// İki alan da zorunlu: geçerli olmadan buton pasif; hata, alandan çıkınca (ya da gönderme denenince) görünür.

const FIELD =
  "w-full rounded-[14px] bg-white/[0.06] px-4 py-3 text-[15px] tracking-[-0.01em] text-white outline-none ring-1 ring-white/[0.08] transition-[box-shadow,background-color] placeholder:text-white/30 focus:bg-white/[0.09] focus:ring-2 focus:ring-accent/60";
const INVALID = "ring-2 ring-red-400/70 focus:ring-red-400/80";

const MIN_NAME = 2;
const MIN_MESSAGE = 10;

export function ContactComposer() {
  const id = useId();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState({ name: false, message: false });

  const nameError = name.trim().length < MIN_NAME ? "Adını yazar mısın?" : "";
  const messageError =
    message.trim().length === 0
      ? "Ne sormak istediğini yaz."
      : message.trim().length < MIN_MESSAGE
        ? `Biraz daha aç: en az ${MIN_MESSAGE} karakter.`
        : "";
  const ready = !nameError && !messageError;
  const showName = touched.name && !!nameError;
  const showMessage = touched.message && !!messageError;

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) {
      setTouched({ name: true, message: true });
      return;
    }
    const text = `Merhaba, ben ${name.trim()}. ${message.trim()}`;
    // Mesajın içeriği ölçüme gitmez, yalnız gönderildiği
    track("mesaj_gonder", { yol: "iletisim_formu" });
    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={send} noValidate className="flex h-full flex-col gap-4">
      <div>
        <label htmlFor={`${id}-ad`} className="mb-2 block text-[14px] text-white/80">
          Adın
        </label>
        <input
          id={`${id}-ad`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          placeholder="Adın ve soyadın"
          autoComplete="name"
          required
          aria-invalid={showName}
          aria-describedby={showName ? `${id}-ad-hata` : undefined}
          className={cn(FIELD, showName && INVALID)}
        />
        {showName && (
          <p id={`${id}-ad-hata`} className="mt-1.5 text-[12.5px] text-red-300">
            {nameError}
          </p>
        )}
      </div>
      <div className="flex flex-1 flex-col">
        <label htmlFor={`${id}-mesaj`} className="mb-2 block text-[14px] text-white/80">
          Mesajın
        </label>
        <textarea
          id={`${id}-mesaj`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, message: true }))}
          placeholder="Ne hakkında konuşmak istersin?"
          rows={5}
          required
          aria-invalid={showMessage}
          aria-describedby={showMessage ? `${id}-mesaj-hata` : undefined}
          className={cn(FIELD, "min-h-[140px] flex-1 resize-none", showMessage && INVALID)}
        />
        {showMessage && (
          <p id={`${id}-mesaj-hata`} className="mt-1.5 text-[12.5px] text-red-300">
            {messageError}
          </p>
        )}
      </div>
      <button
        type="submit"
        disabled={!ready}
        className="group flex h-12 items-center justify-center gap-2.5 rounded-full bg-white text-[15px] font-semibold tracking-[-0.01em] text-[#111] outline-none transition-[opacity,filter] hover:brightness-95 focus-visible:ring-4 focus-visible:ring-accent/50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {"WhatsApp'tan gönder"}
        <PixelIcon
          variant="arrow"
          className="size-[8px] transition-transform duration-300 group-enabled:group-hover:translate-x-0.5"
          cellClassName="fill-[#111]"
        />
      </button>
      <p className="text-center text-[12px] leading-[1.45] text-white/40">
        {"Mesajın WhatsApp'ta hazır açılır. Göndermeden önce kontrol edebilirsin."}
      </p>
    </form>
  );
}
