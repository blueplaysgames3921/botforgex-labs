# BotForgeX Labs

> **Discord Chatbot Factory** — Generate fully-configured, AI-powered Discord bots in seconds.

BotForgeX Labs is a Next.js web application that lets anyone build a custom Discord chatbot without writing code. Fill in a persona, configure behavioral settings, click **Initialize Build**, and download a ready-to-deploy Node.js bot ZIP — complete with a generated system prompt, backstory, and optional pre-injected Pollinations AI key.

---

## Features

- **AI-Generated System Prompts** — Describe your bot's persona in plain text; the app uses the Pollinations AI API to produce a structured, multi-section system prompt (`[CORE IDENTITY]`, `[TONE]`, `[INTERACTION LOGIC]`, `[CONSTRAINTS]`).
- **AI-Generated Backstory** — A two-sentence narrative is synthesized alongside the persona to give your bot a consistent in-character history.
- **Bot Preview Chat** — Test up to two messages against your bot's persona before downloading, powered by a live API call.
- **Neural Uplink (BYOP)** — Authorize via Pollinations to have your personal API key automatically injected into the ZIP, eliminating manual `.env` setup.
- **One-Click ZIP Download** — The generated archive includes `index.js`, `package.json`, `README.md`, `env.txt`, `INSTALL_AND_LAUNCH.txt`, `.gitignore`, and `LICENSE`.
- **Hardware Config Panel** — Toggle Vision, Image Generation, Text-to-Speech, and Casual Mode; set the natural message frequency range with sliders.
- **Built-in Rate Limiting** — The `/api/generate` endpoint enforces 10 requests per 10-minute window per IP using Upstash Ratelimit + Vercel KV.
- **Content Filtering** — Requests containing explicit or NSFW keywords are silently rejected at the API layer.
- **Security Headers** — CSP, `X-Frame-Options`, and `X-Content-Type-Options` are set globally via `next.config.js`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Icons | Lucide React |
| ZIP Generation | JSZip + FileSaver.js |
| LLM Provider | Pollinations AI (OpenAI / Gemini-fast) |
| Rate Limiting | Upstash Ratelimit + Vercel KV |
| Deployment | Vercel |

**Generated Bot Stack**

| Layer | Technology |
|---|---|
| Runtime | Node.js v18+ |
| Discord Library | discord.js v14 |
| LLM / Image | Pollinations AI |
| Voice Synthesis | msedge-tts (Edge TTS) |

---

## Project Structure

```
botforgex-labs/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts        # POST endpoint: prompt generation + rate limiting
│   ├── code/
│   │   └── page.tsx            # Code view page
│   ├── docs/
│   │   └── page.tsx            # Technical documentation page
│   ├── guide/
│   │   └── page.tsx            # Deployment guide page
│   ├── information/
│   │   └── page.tsx            # Information page
│   ├── templates/
│   │   └── page.tsx            # Templates browser page
│   ├── components/
│   │   └── Navbar.tsx          # App-level Navbar component
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main bot-builder UI
├── components/
│   └── Navbar.tsx              # Shared Navbar component
├── lib/
│   └── templates.ts            # Exported bot file templates (INDEX_JS, PACKAGE_JSON, etc.)
├── public/
│   ├── favicon.ico
│   ├── manifest.json
│   ├── robots.txt
│   └── sitemap.xml
├── next.config.js              # Security headers + Next.js config
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- A [Vercel KV](https://vercel.com/docs/storage/vercel-kv) database (for rate limiting)
- A [Pollinations AI](https://pollinations.ai) API key (optional — used as the fallback auth provider)

### Installation

```bash
git clone https://github.com/your-username/botforgex-labs.git
cd botforgex-labs
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Vercel KV (required for rate limiting)
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=

# Pollinations AI (optional — enables the authenticated fallback provider)
POLLINATIONS_KEY=
```

> **Note:** The Vercel KV variables are automatically injected when the project is linked to a Vercel KV store via the Vercel dashboard.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Start

```bash
npm run build
npm run start
```

---

## Deploying to Vercel

1. Push the repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Create a **Vercel KV** store and link it to the project (this auto-populates the `KV_*` environment variables).
4. Optionally add `POLLINATIONS_KEY` to the environment variables for the authenticated AI fallback.
5. Deploy.

---

## How It Works

### Web App (Next.js)

1. The user fills in the **Identity Matrix** (bot name + persona), optional behavioral data, and hardware toggles.
2. Clicking **Initialize Build** presents a modal to choose between **Neural Uplink** (BYOP) or **Standard Build**.
3. The app calls `POST /api/generate` twice — once with `type: "prompt"` to generate the system prompt, and once with `type: "story"` to generate the backstory.
4. A ZIP archive is assembled client-side via JSZip and downloaded automatically.

### API Route (`/api/generate`)

The route handles three request types:

| `type` | Behaviour |
|---|---|
| `prompt` | Instructs the LLM to output a structured Discord bot system prompt based on the persona input. |
| `story` | Instructs the LLM to write a two-sentence bot backstory. |
| `preview_chat` | Instructs the LLM to respond in-character as the configured persona (used by the Preview modal). |

The route first attempts the **Pollinations public endpoint** and falls back to the **authenticated Gemini-fast endpoint** if a `POLLINATIONS_KEY` is set.

### Neural Uplink (BYOP)

When the user selects Neural Uplink, they are redirected to the Pollinations authorization flow. On return, the API key is extracted from the URL hash, stored in `localStorage`, and automatically embedded in the generated `env.txt` inside the ZIP.

---

## Generated Bot Files

The downloaded ZIP contains a fully functional Discord bot:

| File | Description |
|---|---|
| `index.js` | Core bot logic — event listeners, Pollinations API calls, TTS, image generation, and context management. |
| `package.json` | Dependency manifest (`discord.js`, `msedge-tts`, `dotenv`). |
| `env.txt` | Pre-filled configuration template. Rename to `.env` before running. |
| `INSTALL_AND_LAUNCH.txt` | Windows launcher script. Rename to `launch.cmd` and run as Administrator. |
| `README.md` | Bot-specific quick-start instructions. |
| `.gitignore` | Excludes `node_modules`, `.env`, and build artifacts. |
| `LICENSE` | Project license. |

### Bot Capabilities

- Responds conversationally based on the generated AI system prompt.
- Triggers image generation on request via Pollinations image API.
- Reads messages aloud using Edge TTS when voice mode is enabled.
- Analyzes image attachments (vision) when vision mode is enabled.
- Operates within a configurable message frequency range (responds every N–M messages naturally).
- Restricts operation to a specific Discord server via `SERVER_ID`.
- Provides an owner debug command (`!botcheck`) to check API balance.

---

## Deployment Options for the Generated Bot

### Method A — Local / Testing

1. Extract the ZIP archive.
2. Open `env.txt` and fill in `BOT_TOKEN`, `OWNER_ID`, and `SERVER_ID`. If you used the Neural Uplink, `POLLINATIONS_KEY` is already present.
3. Rename `env.txt` to `.env`.
4. Rename `INSTALL_AND_LAUNCH.txt` to `launch.cmd` and run it as Administrator. The script handles Node.js installation and dependency setup automatically.

### Method B — VPS (24/7 Hosting)

1. Provision a Linux VPS running Ubuntu 22.04 or later (AWS, DigitalOcean, etc.).
2. Upload the extracted bot files to the server.
3. Run `npm install` to install dependencies.
4. Use [PM2](https://pm2.keymetrics.io/) to keep the bot alive:

```bash
npm install -g pm2
pm2 start index.js --name my-bot
pm2 save
pm2 startup
```

> **Security Warning:** Never commit or share your `.env` file or any ZIP generated with the Neural Uplink (BYOP) option, as it contains your private API key.

---

## Rate Limiting

The `/api/generate` endpoint is protected by a sliding window rate limiter:

- **Limit:** 10 requests per 10 minutes per IP address
- **Backend:** Upstash Ratelimit + Vercel KV
- **Response on limit exceeded:** HTTP `429` with `X-RateLimit-*` headers and a user-friendly message

---

## Security

- Global HTTP security headers are configured in `next.config.js` (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Permissions-Policy`, and a strict CSP).
- API key extraction uses the URL hash (`window.location.hash`), which is never sent to the server.
- Content filtering on the API route blocks NSFW or prohibited keyword patterns before any LLM call is made.

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## License

See the `LICENSE` file for details.
