# Akhil Gupta — AI Engineer Portfolio

Personal portfolio site for Akhil Gupta, AI engineer. Live at **https://akhil9tiet.github.io**.

[![Live Website](https://img.shields.io/badge/Live_Website-akhil9tiet.github.io-6366f1?style=for-the-badge)](https://akhil9tiet.github.io)

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
python3 -m http.server 8000
# open http://localhost:8000
```
