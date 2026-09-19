# Pin Parvati

Trail journal for the Pin Parvati Pass expedition, built as a Jekyll site
and deployed with GitHub Pages.

## Structure

- `_posts/` — published entries, one per day (or however you split it).
  File name sets the URL and sort order: `YYYY-MM-DD-short-title.md`.
- `_drafts/example-day.md` — reference template for a new entry's front
  matter. Copy it into `_posts/`, rename it, fill it in.
- `assets/images/<slug>/` — photos for one entry, e.g. `assets/images/day-01/`.
- `_layouts/` — page templates (`default.html` shell, `post.html` for entries).
- `assets/css/style.css` — all styling.
- `index.html` — homepage, auto-lists every post in `_posts/`.
- `about.md` — the About page.

## Adding an entry

1. Copy `_drafts/example-day.md` into `_posts/` as `YYYY-MM-DD-title.md`.
2. Drop the day's photos into `assets/images/<slug>/`.
3. Set `cover` and `gallery` in the front matter to those photo paths.
4. Write the narrative in Markdown below the front matter.
5. Commit and push — GitHub Pages rebuilds automatically.

## Enabling GitHub Pages (one-time)

In the repo on GitHub: **Settings → Pages → Source → Deploy from a branch**,
branch `main`, folder `/ (root)`. The site will publish at
`https://shreyas7122.github.io/Pin-Parvati/`.

## Local preview (optional)

Requires Ruby + Bundler.

```
gem install bundler jekyll
jekyll serve
```
