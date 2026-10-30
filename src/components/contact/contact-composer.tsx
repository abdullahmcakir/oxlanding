"use client";

import { useState } from "react";
import { PixelIcon } from "@/components/navbar/pixel-icon";
import { openAssistant } from "@/lib/assistant";
import { whatsappUrl } from "@/lib/links";

// Referanstaki form kutusu. Ayrı bir gelen kutusu açmamak için mesaj gönderilmez, WhatsApp'ta hazır yazılmış
// olarak açılır (tek gelen kutusu: WhatsApp, oradan OX Panel'e). Ziyaretçi form doldurmuş gibi hisseder.

const FIELD =
  "w-full rounded-[14px] bg-white/[0.06] px-4 py-3 text-[15px] tracking-[-0.01em] text-white outline-none ring-1 ring-white/[0.08] transition-[box-shadow,background-color] placeholder:text-white/30 focus:bg-white/[0.09] focus:ring-2 focus:ring-accent/60";

export function ContactComposer() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const ready = message.trim().length > 0;

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    const text = `${name.trim() ? `Merhaba, ben ${name.trim()}. ` : "Merhaba, "}${message.trim()}`;
    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={send} className="flex h-full flex-col gap-4">
      <label className="block">
        <span className="mb-2 block text-[14px] text-white/80">Adın</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ad Soyad"
          autoComplete="name"
          className={FIELD}
        />
      </label>
      <label className="flex flex-1 flex-col">
        <span className="mb-2 block text-[14px] text-white/80">Mesajın</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Aklındaki projeyi ya da sorunu birkaç cümleyle yaz"
          rows={5}
          required
          className={`${FIELD} min-h-[140px] flex-1 resize-none`}
        />
      </label>
      <button
        type="submit"
        disabled={!ready}
        className="group flex h-12 items-center justify-center gap-2.5 rounded-full bg-white text-[15px] font-semibold tracking-[-0.01em] text-[#111] transition-[opacity,filter] hover:brightness-95 disabled:opacity-40"
      >
        {"WhatsApp'tan gönder"}
        <PixelIcon
          variant="arrow"
          className="size-[8px] transition-transform duration-300 group-enabled:group-hover:translate-x-0.5"
          cellClassName="fill-[#111]"
        />
      </button>
      <p className="text-center text-[12px] leading-[1.45] text-white/40">
        {"Mesajın WhatsApp'ta hazır açılır, göndermeden önce düzenleyebilirsin. "}
        <button
          type="button"
          onClick={() => openAssistant("genel bir konu")}
          className="text-white/70 underline underline-offset-2 transition-colors hover:text-white"
        >
          Ya da asistana sor
        </button>
      </p>
    </form>
  );
}
