# Static Site Refactor

This project stays as plain static HTML, CSS, and JavaScript. The original cloned `index.html` is kept as a snapshot of the source clone, while the maintainable source now lives under `src/`.

## Structure

```text
src/
  index.template.html
  partials/
    head.html
    header.html
    hero.html
    specialties.html
    services.html
    contact.html
    footer.html
    popup.html
    scripts.html
scripts/
  build.js
dist/
  index.html
  assets/
```

## Edit workflow

- Edit section markup in `src/partials/`.
- `src/partials/head.html` contains everything inside `<head>`.
- `src/partials/header.html` contains the preloader and header/navigation block.
- `src/partials/hero.html` contains the main banner and the original `#about` section. The required partial list did not include a separate `about.html`, so those two sections stay together here.
- `src/partials/scripts.html` contains the bottom script stack and the lightbox DOM so the generated output keeps the original load order.
- `src/partials/popup.html` currently contains the original popup placeholder comments because the cloned source did not include standalone popup markup.

## Build

1. Run `npm run build`
2. Open or deploy `dist/index.html`

The build script:

- reads `src/index.template.html`
- injects all partials at build time
- writes `dist/index.html`
- copies `assets/` into `dist/assets`
- creates compatibility files under `dist/template08/images/demo08/` for the legacy inline image URLs used by the source HTML

## Local preview

Run `npm run dev` to rebuild and serve the `dist/` folder.

## Optional reset

If you need to regenerate the initial `src/` files from the original cloned root `index.html`, run:

```bash
node scripts/build.js --bootstrap-source
```

Do not use that reset command after making manual edits in `src/partials/` unless you intentionally want to overwrite them from the original clone snapshot.
