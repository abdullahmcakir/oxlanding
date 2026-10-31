import { track } from "./analytics";
import { whatsappUrl } from "./links";

/**
 * Sağ alttaki asistanın "Bana sor" eylemi.
 *
 * Hedef: ElevenLabs konuşma ajanı, yazılı sohbet öncelikli (mikrofona basmaktan çekinen ziyaretçi yazabilsin),
 * ses isteğe bağlı. Bağlamak için ElevenLabs panelinden bir agent oluşturulup kimliği
 * NEXT_PUBLIC_ELEVENLABS_AGENT_ID olarak verilecek ve bu fonksiyon ajanı açacak şekilde güncellenecek.
 * Ajanın cevaplayamadığı sorular OX Panel'e düşmeli (tek gelen kutusu).
 * O zamana kadar ziyaretçi, sorusu hazır yazılmış bir WhatsApp mesajına yönlendirilir: hızlı soru için en doğal yol.
 */
export function openAssistant(topic: string) {
  track("asistan_ac", { konu: topic });
  window.open(whatsappUrl(`Merhaba, ${topic} hakkında bir sorum var.`), "_blank", "noopener,noreferrer");
}
