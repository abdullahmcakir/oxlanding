"use client";

import { useEffect, useState } from "react";

const timeFmt = new Intl.DateTimeFormat("tr-TR", {
  timeZone: "Europe/Istanbul",
  hour: "2-digit",
  minute: "2-digit",
});

const dateFmt = new Intl.DateTimeFormat("tr-TR", {
  timeZone: "Europe/Istanbul",
  day: "numeric",
  month: "long",
});

// Footer biçimi: "ÖÖ 08:25 - Eki 18 2026"
const time12Fmt = new Intl.DateTimeFormat("tr-TR", {
  timeZone: "Europe/Istanbul",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});
const shortDateFmt = new Intl.DateTimeFormat("tr-TR", {
  timeZone: "Europe/Istanbul",
  day: "numeric",
  month: "short",
  year: "numeric",
});

type Variant = "time" | "datetime" | "footer";

function format(variant: Variant) {
  const now = new Date();
  if (variant === "footer") {
    const parts = Object.fromEntries(shortDateFmt.formatToParts(now).map((p) => [p.type, p.value]));
    return `${time12Fmt.format(now)} - ${parts.month} ${parts.day} ${parts.year}`;
  }
  const time = timeFmt.format(now);
  return variant === "time" ? time : `${dateFmt.format(now)}, ${time}`;
}

// Sunucu ile istemci saati farklı olacağı için ilk render'da null döner (hydration uyumsuzluğu olmasın).
export function useIstanbulTime(variant: Variant = "time") {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setValue(format(variant));
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 10_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [variant]);

  return value;
}
