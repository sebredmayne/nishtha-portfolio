# Nishtha's portfolio

A "file drawer" portfolio: a home page opens into an interactive file cabinet, which
opens into four folders (AI tools, Dashboards, Strategy & Ventures, Off the clock).

Plain HTML/CSS/vanilla JS — no build step. Open `index.html` directly, or serve it
locally:

```
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Structure

```
index.html          Home
drawer.html          The file cabinet (interactive — js/drawer.js)
ai-tools.html         Folder A — On Brief, Mosaic Pulse
dashboards.html       Folder B — Acquisition ads, Channel performance
ventures.html         Folder C — Category @ Mosaic, Venture Catalysts, Meerahi VR, Ember, case comps
fun.html               Folder D — writing, crochet, reading list
css/style.css          Design tokens + shared styles
js/drawer.js           The drawer's tab layout + file-picker state machine
js/motion.js           Scroll-reveal for each folder's "sheets" (GSAP, with a no-JS-safe fallback)
assets/images/         Dashboard/product screenshots
```

Motion: GSAP (loaded from a CDN) drives scroll-reveal and the drawer's pop-up card;
every page is wired so content stays fully visible and readable even if JS is
disabled or the CDN is unreachable. Page-to-page navigation also opts into the
browser's native View Transitions where supported (Chrome/Edge/Safari), for a
smoother cut between pages.

## Still to fill in

Every `[BRACKETED]` placeholder below needs real content before this is ready to share.

**index.html**
- [ ] LinkedIn, email, resume links in the header
- [ ] The "nishtha's files" pill shows `13` but there are only 12 files now (Bharatanatyam was dropped) — update the count

**ai-tools.html**
- [ ] On Brief: the walkthrough video link, the "try On Brief" live link
- [ ] Mosaic Pulse: the walkthrough video link

**dashboards.html**
- [ ] Acquisition ads: your specific part in building it ("[DATA JOINS + PAGE BUILD]"), the "what it showed" sticky note
- [ ] Channel performance: your specific part in building it ("[YOUR PART]")

**ventures.html**
- Category @ Mosaic is fully written up (NutriMix 2+, the funnel, ad performance cards, the Substack link) — nothing left here

## Swapping in a real video

The "▶ watch the walkthrough" buttons in `ai-tools.html` are plain pill links
(`<a class="cta-row filled">`). Point their `href` at a Loom/YouTube link, or swap
the button for an embedded player:
- **Self-hosted**: an `<video controls src="assets/video/your-clip.mp4">` somewhere on the page.
- **Loom/YouTube embed**: an `<iframe>` using that platform's embed code.

## Deploying

Any static host works as-is (no build step): GitHub Pages, Netlify, Vercel, etc.
