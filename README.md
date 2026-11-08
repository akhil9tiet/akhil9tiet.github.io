# Akhil Gupta — AI Engineer Portfolio


Personal portfolio site for Akhil Gupta, AI engineer. Live at **https://akhil9tiet.github.io**.


[![Live Website](https://img.shields.io/badge/Live_Website-akhil9tiet.github.io-6366f1?style=for-the-badge)](https://akhil9tiet.github.io)

## About

Akhil Gupta is a Senior AI Engineer at Tesla with 10+ years of software engineering experience, building agentic AI systems — autonomous agents, tool-using LLM applications, and the infrastructure that makes them reliable in production.

## Focus

- **Agentic AI** — multi-step agents, tool calling, and eval-driven iteration
- **AI engineering** — LLM applications, retrieval, and production AI systems
- **Open source** — fixes and features in NVIDIA NVSentinel, Microsoft PyRIT, Meta Pyrefly, Hugging Face Diffusers, and more (see [pull requests](https://github.com/pulls?q=is%3Apr+author%3Aakhil9tiet))

## Open source highlights

Merged contributions to AI and developer-tooling projects:

- **NVIDIA NVSentinel** — exclude repeated XID 45 errors from `RepeatedXIDErrorOnSameGPU` ([PR #2064](https://github.com/NVIDIA/NVSentinel/pull/2064))
- **Microsoft PyRIT** — use lazy logging args in `apply_defaults` debug logs ([PR #3925](https://github.com/microsoft/PyRIT/pull/3925))
- **microsoft/nvx** — `check-required-ci` no longer silently accepts malformed `--run-*` flags ([PR #498](https://github.com/microsoft/nvx/pull/498)); `doctor check_rate` no longer fails H4 when the host clocksource is unreadable ([PR #509](https://github.com/microsoft/nvx/pull/509))

See the full list of [pull requests](https://github.com/pulls?q=is%3Apr+author%3Aakhil9tiet).

## Hire me

Looking for a Senior AI Engineer? See the [hire-me page](https://akhil9tiet.github.io/hire-ai-engineer.html) or reach out at [akhilgupta.swe@gmail.com](mailto:akhilgupta.swe@gmail.com).

## Pages

- `index.html` — main portfolio

- `hire-ai-engineer.html` — hire-me landing page

- `claudeLoader/index.html` — standalone demo page

## Structure

```
├── index.html / hire-ai-engineer.html
├── assets/            # images, videos, icons
├── css/               # main.css + css/blockreveal/ (reveal-animation styles)
├── js/
│   ├── telemetry.js         # GA4 + scroll-milestone tracking
│   ├── visitor-location.js  # IP-based visitor location (ipapi.co) → #visitor-location-value
│   └── blockreveal/         # vendored anime.js + RevealFx block-reveal effect
├── robots.txt / sitemap.xml / site.webmanifest
├── googled5c08af53433f134.html  # Google Search Console verification — do not delete
└── _config.yml                  # GitHub Pages (Jekyll) config
```

## Dependencies

No build step — plain HTML/CSS/JS served by GitHub Pages.

- **Bootstrap 3.4.1** CSS via CDN (grid/layout)
- **anime.js 3.2.2** vendored in `js/blockreveal/` (powers the RevealFx block-reveal animations)
- **Google Analytics 4** via `js/telemetry.js`

## Run locally

```bash
py -m http.server 8000
# open http://localhost:8000
```
