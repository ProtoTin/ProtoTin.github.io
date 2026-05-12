# Tin Aung — Cybersecurity Portfolio

Personal portfolio website for Tin Aung, U.S. Navy veteran and cybersecurity engineering graduate student at the University of San Diego.

## Stack

Plain HTML5, CSS3, and vanilla JavaScript. No frameworks, no build tools, no dependencies.

## Structure

```
portfolio/
├── index.html          # Main entry point
├── css/
│   └── style.css       # All styles (dark theme, fully responsive)
├── js/
│   └── main.js         # Mobile nav toggle + active scroll highlight
├── assets/
│   └── icons/          # Placeholder for icons or images
└── README.md
```

## Running Locally

Open `index.html` directly in a browser, or serve with any static file server:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploying

Drop the directory onto any static host — GitHub Pages, Netlify, Cloudflare Pages, etc. No build step needed.

## Sections

- **Hero** — Name, title, tagline, GitHub and LinkedIn links
- **About** — Education, military background, focus areas
- **Certifications** — CompTIA Security+ and CySA+
- **Technical Skills** — Grouped by category
- **Projects** — Five lab/academic projects as cards
- **Experience** — U.S. Navy timeline entry
- **Contact** — Email, GitHub, LinkedIn
