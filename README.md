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
fun.html               Folder D — writing, crochet, reading list, Bharatanatyam
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

**ai-tools.html**
- [ ] On Brief: role (solo/team), a Loom walkthrough video, two product screenshots, the live link
- [ ] Mosaic Pulse: role (solo/team), model/data sources used, a Loom walkthrough video, the "lesson" sticky note

**dashboards.html**
- [ ] Acquisition ads: your specific part in building it, the "what it showed" sticky note
- [ ] Channel performance: your specific part in building it

**ventures.html**
- [ ] Category @ Mosaic: the product you owned, the growth stat, the ad-test table, what you owned, the lesson sticky note

**fun.html**
- [ ] Your photo (ID badge), 3 books + one-line takes, your first Substack post + link, a crochet photo, a Bharatanatyam photo, what you're currently into

## Swapping in a real video

The two `.video-card` placeholders in `ai-tools.html` are plain `<a>` tags styled to
look like a video thumbnail. To embed a real clip:
- **Self-hosted**: replace the `<a class="video-card">...</a>` block with a
  `<video class="video-card" controls src="assets/video/your-clip.mp4"></video>`.
- **Loom/YouTube embed**: replace it with an `<iframe>` from that platform's embed
  code, and drop the `video-card` classes onto its wrapper `<div>` for consistent sizing.

## Deploying

Any static host works as-is (no build step): GitHub Pages, Netlify, Vercel, etc.
