# Repository instructions

This repository is a static website with Jekyll-generated writing pages. GitHub Actions builds and deploys the site using `.github/workflows/pages.yml`.

For standalone HTML pages, serve the repository directly from its root:

```sh
python3 -m http.server 8001
```

Open `http://localhost:8001/` in a browser. This previews standalone pages only; it does not process front matter, Liquid templates, or Markdown posts.

To verify `writing.html`, essay layouts, or posts, use a fresh Jekyll build with the plugins from `_config.yml`, then serve the generated `_site` directory. An existing `_site` directory may be stale. If Jekyll dependencies are unavailable, report that rendered pages have not been verified; a plain HTTP preview is not a substitute.

Verify changed pages for responsive layouts, links, images, and browser-console errors when relevant. Keep generated `_site` output and caches out of commits.
