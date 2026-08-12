# Dernek Yönetim Sistemi — Frontend

React + TypeScript + Vite + Tailwind CSS ile yazılmış dernek web sitesi. Veri katmanı TanStack Query üzerinden [assid-api-nestjs](https://github.com/GreenPiDev/assid-api-nestjs) backend'ine bağlanır.

## Kurulum

```bash
npm install
cp .env.example .env   # VITE_API_URL'i backend adresine göre düzenle
npm run dev
```

## Ortam Değişkenleri

```
VITE_API_URL=http://localhost:3000/api
```

## Mimari

- **`api/client.ts`** — backend ile konuşan tek nokta. Backend'in gerçek veri şeklini frontend bileşenlerinin beklediği şekle dönüştürür; backend adresi/şekli değişse bile bileşenlere dokunulmaz.
- **`api/factory.ts` + `api/resources/*`** — TanStack Query üzerine kurulu generic `useGet`/`useGetList` hook'ları ve her kaynak (members, news, events) için ince sarmalayıcılar.
- **`constants/sectors.ts`** — sektörler admin tarafından yönetilmez, sistemde sabit bir liste olarak tutulur (backend'deki enum ile birebir aynı).
- **`components/ui`** — Tailwind ile yazılmış küçük, tekrar kullanılabilir primitive'ler (ör. `Button`).
- **`pages/FirmaRehberiPage`** — sürüklenebilir harita + sektör/faaliyet alanı filtreleriyle firma rehberi.

## Notlar

- Sadece `isApproved: true` olan üyeler herkese açık sitede görünür; bu filtre backend'e giden isteklerde uygulanır.
- Üye girişi ve admin paneli henüz eklenmedi.
