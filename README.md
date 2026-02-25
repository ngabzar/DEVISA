# NihongoQuest 🇯🇵

App belajar bahasa Jepang (JLPT N1–N5, JFT) — Angular 21 + Capacitor → Android APK

## 🚀 Build APK via GitHub Actions (Otomatis)

### Langkah-langkah:
1. **Upload project ini ke GitHub** (push ke branch `main` atau `master`)
2. **GitHub Actions akan otomatis berjalan** dan build APK
3. Setelah selesai (~10–20 menit), buka tab **Actions** di GitHub repo kamu
4. Klik workflow run terbaru → scroll ke bawah → klik **NihongoQuest-debug-APK** di bagian *Artifacts*
5. Download ZIP → extract → install `app-debug.apk` di Android kamu

> **Enable "Install from unknown sources"** di Android sebelum install APK.

## 🛠️ Pipeline Build
```
npm ci → ng build (8GB RAM) → cap add android → cap sync → gradlew assembleDebug → APK ✅
```

## 📁 Struktur Penting
- `src/` — Source Angular app (komponen, data, service)
- `capacitor.config.ts` — Konfigurasi Capacitor (appId, webDir)
- `package.json` — Dependencies + script build:ci
- `.github/workflows/build-apk.yml` — GitHub Actions pipeline
