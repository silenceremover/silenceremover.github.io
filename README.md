# SilenceRemover | Free Local Audio Silence Trimmer

<div align="center">

![SilenceRemover Hero Banner](https://res.cloudinary.com/dpx6w78bt/image/upload/f_auto/q_auto/v1786342039/Online_Tool_rc1ybr.png)

> **100% Client-Side, Zero-Server Audio Silence Remover** built with **Astro**, **React (Islands Architecture)**, and **Tailwind CSS**.  
> Designed for maximum technical SEO, absolute data privacy, and instant in-browser audio processing.

[![Live Site](https://img.shields.io/badge/Live%20Site-silenceremover.github.io-6366f1?style=for-the-badge&logo=google-chrome&logoColor=white)](https://silenceremover.github.io)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Client--Side-10b981?style=for-the-badge&logo=shield&logoColor=white)](#privacy-guarantee)
[![Support Developer](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Support%20Creator-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/kisharadilz)

</div>

---

## 🌟 Key Features

- 🔒 **100% Client-Side Privacy**: Audio decoding, amplitude analysis, buffer slicing, and audio re-stitching happen completely inside browser memory via the Web Audio API. Zero files or voice data ever touch a remote server.
- ⚡ **Instant Processing**: Native browser decoding for **MP3, WAV, M4A, AAC, OGG, and FLAC** without waiting for slow server uploads or cloud queue times.
- ✂️ **Intelligent Zero-Crossing Micro-Crossfades**: Eliminates audio pops, clicks, and DC-offset artifacts using automatic 4ms cosine crossfades at every cut point.
- 🎚️ **Customizable Parameters & Presets**:
  - **Silence Decibel (dB) Threshold Slider** (`-60 dB` to `-15 dB`, default `-36 dB`)
  - **Minimum Silence Duration Slider** (`100ms` to `1200ms`, default `300ms`)
  - **Safety Margin / Padding Slider** (`10ms` to `150ms`, default `40ms`)
  - **Built-in Presets**: *Podcast & Speech*, *Audiobook Clean*, *Aggressive Cut*, *Gentle / Natural*.
- 📊 **Interactive Waveform Visualizer**: Inspect cuts visually on a high-DPI canvas showing active speech vs removed silence with real-time scrub and seek.
- 🎧 **Built-in A/B Audio Player**: Preview trimmed vs original audio side-by-side with playback rate adjustments (`0.75x` to `2x`) and volume control.
- 💾 **Dual Studio Export**: Download uncompressed 16-bit PCM WAV (lossless) or high-bitrate MP3 encoded directly in-browser via `lamejs`.
- 🌍 **Automatic Country & Flag Detection**: Detects user country (240+ countries) in 0ms with instant timezone heuristics and renders crisp national flag icons (e.g. 🇺🇸 US, 🇱🇰 LK, 🇨🇳 CN, 🇬🇧 GB, 🇩🇪 DE, 🇯🇵 JP).
- 📱 **Mobile & Tablet Optimized Navigation**: Sleek, tap-friendly icon-only controls for language, theme, and coffee support on mobile viewports.
- 📖 **Dedicated Educational Guide**: Full technical SEO guide at [`/how-to-remove-silence-from-audio-free/`](https://silenceremover.github.io/how-to-remove-silence-from-audio-free/) targeting high-intent Google search queries.
- 🔍 **100% World-Class Technical SEO**:
  - In-browser Cloudinary CDN OpenGraph & Twitter banner integration
  - JSON-LD Schemas: `WebSite`, `Organization`, `WebApplication`, `SoftwareApplication`, `FAQPage`, `HowTo`, `TechArticle`, `BreadcrumbList`
  - Canonical URLs & bidirectional `hreflang` alternates across 6 languages
  - Preconnect & DNS-prefetch resource hints for Core Web Vitals (sub-second LCP & 0 CLS).

---

## 🎨 Design System & Palette

Crafted with a clean, accessible pastel aesthetic:

| Color Token | Hex Code | Role |
| :--- | :--- | :--- |
| **Lavender Accent** | `#B1B2FF` | Primary CTA buttons, key highlights, playhead |
| **Soft Blue** | `#AAC4FF` | Interactive hovers, secondary waveform bars |
| **Periwinkle Surface** | `#D2DAFF` | Card borders, subtle container surfaces |
| **Ice Light** | `#EEF1FF` | Light mode body background, dark mode text |
| **Slate Dark** | `#0F172A` | Dark mode body background |
| **Charcoal Surface** | `#1E293B` | Light mode text, dark mode cards |

---

## 🌐 Supported Locales (Astro Subpath Routing)

Static multilingual subpaths generated out of the box:

| Locale | Route | Language | Status |
| :--- | :--- | :--- | :--- |
| `en` (Default) | `https://silenceremover.github.io/` | English | ✅ Active |
| `es` | `https://silenceremover.github.io/es/` | Español | ✅ Active |
| `pt` | `https://silenceremover.github.io/pt/` | Português | ✅ Active |
| `de` | `https://silenceremover.github.io/de/` | Deutsch | ✅ Active |
| `fr` | `https://silenceremover.github.io/fr/` | Français | ✅ Active |
| `ja` | `https://silenceremover.github.io/ja/` | 日本語 | ✅ Active |

---

## 🛠️ Technology Stack

- **Framework**: [Astro 5](https://astro.build) (Static Site Generation for sub-second page loads)
- **UI Islands**: [React 19](https://react.dev) (`<SilenceRemover client:load />`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with `@tailwindcss/vite`
- **Audio Core**: Native **Web Audio API** (`AudioContext`, `AudioBuffer`)
- **Encoding**: PCM WAV encoder + [`lamejs`](https://github.com/zhuker/lamejs) for MP3 export
- **Assets & Icons**: [`lucide-react`](https://lucide.dev) & [FlagCDN](https://flagcdn.com)
- **CDN Media**: [Cloudinary](https://cloudinary.com) for high-performance social preview caching

---

## 🚀 Getting Started

### Prerequisites

- Node.js `22.x` or later
- npm `10.x` or later

### Installation

```bash
# Clone the repository
git clone https://github.com/silenceremover/silenceremover.github.io.git
cd silenceremover.github.io

# Install dependencies
npm install
```

### Local Development

```bash
# Start Astro development server
npm run dev
```

Visit `http://localhost:4321` in your browser.

### Production Build

```bash
# Build static site to ./dist
npm run build

# Preview production build locally
npm run preview
```

---

## 📦 Deployment to GitHub Pages

This project is configured for automated static deployment via GitHub Actions:

- Workflow located in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
- Automatically triggers on push to the `main` branch.
- Deploys static build to `https://silenceremover.github.io`.

---

## ☕ Support the Developer

SilenceRemover is 100% free, private, and ad-free. If it saved you editing time, consider buying a coffee!

👉 **[Buy Me a Coffee](https://buymeacoffee.com/kisharadilz)**

---

## 📄 License

MIT License. Free to use, adapt, and build upon.
