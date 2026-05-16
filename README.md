# Calm Down App

A mobile-first, Progressive Web App (PWA) that guides people through a personalized calm-down plan in moments of stress or emotional overwhelm. No login, no backend, no app store — just open the URL and go.

Built around the Marriage Helper Calm Down Toolkit, the app walks users through a stress check-in, category selection, and a curated set of guided tools (breathing exercises, journaling, visualization, gratitude prompts, and more).

---

## Features

- **Stress check-in** — pick a number 1–10; the app adapts tool recommendations to your level
- **PIES framework** — Physical, Intellectual, Emotional, Spiritual categories narrow the tool list to what actually fits
- **13 guided tools** — Box Breathing, Gratitude, Name the Lie, Safe Place Visualization, Habit Loop Audit, Prayer Prompt, and more
- **Safety interstitial** — non-clinical 988 Lifeline reminder surfaces automatically at stress levels 8–10
- **Installable PWA** — works offline, installs to iOS and Android home screen like a native app
- **No data stored** — every session is fresh; nothing is saved between visits
- **Calm color system** — deep indigo-navy palette designed to reduce stimulation, not add to it

---

## Tech Stack

Pure HTML, CSS, and vanilla JavaScript. No frameworks, no build tools, no npm. The entire app is static files served by nginx inside a Docker container.

---

## Running with Docker (recommended)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your server

### Quick start

```bash
git clone https://github.com/gismc123/calm.git
cd calm
docker compose up -d
```

The app will be available at `http://localhost:901`.

### What the container does

The `Dockerfile` copies all static files into an `nginx:alpine` image and serves them on port 80. Docker Compose maps that to port `901` on the host.

```
Host port 901  →  Container port 80  →  nginx serves static files
```

To change the host port, edit `docker-compose.yml`:

```yaml
ports:
  - "901:80"   # change 901 to whatever port you want on the host
```

---

## Serving on a subdomain (e.g. calm.yourdomain.com)

The container exposes port `901` on the host. You need a reverse proxy sitting in front of it to route your subdomain to that port. Below are configs for the three most common self-hosted setups.

### Nginx Proxy Manager (GUI)

1. Go to **Proxy Hosts → Add Proxy Host**
2. **Domain Names:** `calm.yourdomain.com`
3. **Scheme:** `http`
4. **Forward Hostname / IP:** `localhost` (or the LAN IP of your server)
5. **Forward Port:** `901`
6. Enable **Block Common Exploits** and request an SSL certificate under the **SSL** tab

### Traefik (Docker label-based)

Add labels to the service in `docker-compose.yml`:

```yaml
services:
  calm-down-app:
    build: .
    container_name: calm-down-app
    restart: unless-stopped
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.calm.rule=Host(`calm.yourdomain.com`)"
      - "traefik.http.routers.calm.entrypoints=websecure"
      - "traefik.http.routers.calm.tls.certresolver=letsencrypt"
      - "traefik.http.services.calm.loadbalancer.server.port=80"
```

Remove the `ports` block — Traefik handles routing directly through the Docker network.

### Caddy

```
calm.yourdomain.com {
    reverse_proxy localhost:901
}
```

Caddy handles HTTPS automatically via Let's Encrypt.

---

## Updating from GitHub

```bash
git pull
docker compose up -d --build
```

The `--build` flag rebuilds the image so the latest files are included.

---

## PWA / Install to Home Screen

- **Android (Chrome):** A banner appears on first visit prompting you to install. Tap **Install**.
- **iOS (Safari):** Tap the Share icon → **Add to Home Screen**.

Once installed, the app launches in standalone mode (no browser chrome) and works fully offline.

---

## File Structure

```
calm/
├── index.html          # App shell — all four screens
├── style.css           # All styles, CSS custom properties
├── app.js              # Screen logic, tool timers, session state
├── manifest.json       # PWA manifest (icons, display mode, theme color)
├── sw.js               # Service worker — caches assets for offline use
├── Dockerfile          # nginx:alpine image, copies static files
├── docker-compose.yml  # Maps container port 80 to host port 901
├── .dockerignore       # Keeps docs and compose files out of the image
└── assets/
    ├── icon-192.png    # PWA icon (192×192)
    ├── icon-512.png    # PWA icon (512×512)
    └── icon-apple.png  # iOS touch icon (180×180)
```

---

## License

Personal use. Source material © Marriage Helper.
