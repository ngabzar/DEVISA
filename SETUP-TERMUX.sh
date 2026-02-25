#!/bin/bash
# ============================================================
#  NIHONGOQUEST — Script Push ke GitHub via Termux
#  Jalankan: bash SETUP-TERMUX.sh
# ============================================================

set -e

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════╗"
echo "║   NihongoQuest → GitHub via Termux       ║"
echo "╚══════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${YELLOW}[1/6] Install git & openssh...${NC}"
pkg update -y -q
pkg install -y git openssh 2>/dev/null || true

echo ""
echo -e "${CYAN}Masukkan info GitHub kamu:${NC}"
read -p "  Username GitHub      : " GH_USER
read -p "  Nama repo baru       : " GH_REPO
read -p "  Email GitHub         : " GH_EMAIL
echo -e "  ${YELLOW}Buat token di: github.com → Settings → Developer settings → Personal access tokens (classic)${NC}"
echo -e "  ${YELLOW}Centang: repo + workflow${NC}"
read -p "  Personal Access Token: " GH_TOKEN

echo ""
echo -e "${YELLOW}[2/6] Konfigurasi git...${NC}"
git config --global user.name "$GH_USER"
git config --global user.email "$GH_EMAIL"
git config --global init.defaultBranch main
git config --global credential.helper store
echo "https://${GH_USER}:${GH_TOKEN}@github.com" > ~/.git-credentials
chmod 600 ~/.git-credentials
echo -e "${GREEN}  ✓ Git config selesai${NC}"

echo ""
echo -e "${YELLOW}[3/6] Cek folder project...${NC}"
if [ -d "FIXLORD-main" ]; then
  PROJECT_DIR="FIXLORD-main"
elif [ -f "package.json" ]; then
  PROJECT_DIR="."
else
  echo -e "${RED}ERROR: Tidak menemukan folder project!${NC}"
  exit 1
fi
echo -e "${GREEN}  ✓ Project ditemukan: $PROJECT_DIR${NC}"
cd "$PROJECT_DIR"

echo ""
echo -e "${YELLOW}[4/6] Inisialisasi git repository...${NC}"
[ -d ".git" ] && rm -rf .git
git init

mkdir -p .github/workflows

# Tulis ulang workflow file (versi FIXED - tanpa cache: npm)
cat > .github/workflows/build-apk.yml << 'WORKFLOWEOF'
name: Build Android APK

on:
  push:
    branches: [main, master]
  workflow_dispatch:

jobs:
  build:
    name: Build APK
    runs-on: ubuntu-latest
    timeout-minutes: 60

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Cache node_modules
        id: cache-npm
        uses: actions/cache@v4
        with:
          path: node_modules
          key: node-modules-${{ hashFiles('package.json') }}
          restore-keys: node-modules-

      - name: Cache Gradle packages
        uses: actions/cache@v4
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: gradle-${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
          restore-keys: gradle-

      - name: Install npm dependencies
        run: npm install --legacy-peer-deps

      - name: Build Angular app
        run: npm run build:ci
        env:
          NODE_OPTIONS: "--max-old-space-size=8192"

      - name: Initialize Capacitor Android
        run: npx cap add android || true
        env:
          NODE_OPTIONS: "--max-old-space-size=4096"

      - name: Capacitor sync
        run: npx cap sync android
        env:
          NODE_OPTIONS: "--max-old-space-size=4096"

      - name: Make gradlew executable
        run: chmod +x android/gradlew

      - name: Build debug APK
        working-directory: android
        run: ./gradlew assembleDebug --no-daemon --stacktrace
        env:
          GRADLE_OPTS: "-Xmx4g -Xms512m -XX:MaxMetaspaceSize=512m"

      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: NihongoQuest-debug-APK
          path: android/app/build/outputs/apk/debug/app-debug.apk
          retention-days: 30

      - name: Show APK info
        run: ls -lh android/app/build/outputs/apk/debug/app-debug.apk
WORKFLOWEOF

echo -e "${GREEN}  ✓ Workflow file dibuat (versi fixed)${NC}"

echo ""
echo -e "${YELLOW}[5/6] Commit semua file...${NC}"

# Pastikan .github tidak ter-ignore
grep -q "!.github" .gitignore 2>/dev/null || printf "\n!.github\n!.github/**\n" >> .gitignore

git add -A
git add -f .github/workflows/build-apk.yml
git commit -m "feat: Add Capacitor APK builder + GitHub Actions (fixed)"
echo -e "${GREEN}  ✓ Commit berhasil${NC}"

echo ""
echo -e "${YELLOW}[6/6] Push ke GitHub...${NC}"
echo ""
echo -e "${YELLOW}  PENTING: Buat repo kosong dulu di github.com/${GH_USER}${NC}"
echo -e "${YELLOW}  Nama repo: ${GH_REPO} | JANGAN centang 'Add README'${NC}"
read -p "  Sudah buat? Tekan ENTER..."

git remote remove origin 2>/dev/null || true
git remote add origin "https://${GH_USER}:${GH_TOKEN}@github.com/${GH_USER}/${GH_REPO}.git"
git branch -M main
git push -u origin main --force

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗"
echo "║   ✅ BERHASIL! Project sudah di GitHub   ║"
echo "╚══════════════════════════════════════════╝${NC}"
echo ""
echo -e "  Repo  : ${CYAN}https://github.com/${GH_USER}/${GH_REPO}${NC}"
echo -e "  Actions: ${CYAN}https://github.com/${GH_USER}/${GH_REPO}/actions${NC}"
echo ""
echo "  Tunggu ~15 menit → download APK dari bagian Artifacts"
