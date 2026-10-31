# Dokploy için: Next standalone çıktısı (next.config.ts output: "standalone") küçük bir Node imajında çalışır.
#
# NEXT_PUBLIC_* değerleri build sırasında tarayıcı koduna gömülür: Dokploy'da "Build-time Arguments"a yazılır,
# değişince yeniden build gerekir. Sunucu sırları (OX_PANEL_OLCUM_KEY vb.) "Environment"a yazılır, build'e girmez.

FROM node:24-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_PANEL_TALEP_URL
ARG NEXT_PUBLIC_WHATSAPP_NUMBER
ARG NEXT_PUBLIC_META_PIXEL_ID
ARG NEXT_PUBLIC_GA4_ID
ARG NEXT_PUBLIC_GOOGLE_ADS_ID
ARG NEXT_PUBLIC_GOOGLE_ADS_TALEP_LABEL
ARG NEXT_PUBLIC_PAGESPEED_KEY
# Test kopyası için 1: arama motorlarına kapalı
ARG NOINDEX
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:24-slim AS run
WORKDIR /app
ARG NOINDEX
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NOINDEX=$NOINDEX \
    PORT=3000 \
    HOSTNAME=0.0.0.0
# node imajındaki hazır yetkisiz kullanıcı; .next/cache'e yazabilsin diye dosyalar ona ait
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
# Görsel optimizasyonu (next/image) sharp ister; dosya takibi platform kütüphanelerini (@img/*) her zaman yakalamıyor,
# eksik kalırsa görseller sessizce optimize edilmeden gider. Açıkça kopyalanır.
COPY --from=build --chown=node:node /app/node_modules/sharp ./node_modules/sharp
COPY --from=build --chown=node:node /app/node_modules/@img ./node_modules/@img
USER node
EXPOSE 3000
CMD ["node", "server.js"]
