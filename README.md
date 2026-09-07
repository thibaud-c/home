# Thibaud Chassin — GIS & Digital Geographies

A Vue 3 / Vite academic portfolio with a minimalist neon theme and an interactive ASCII Earth. The globe uses the existing Earth texture and Canvas 2D; no external map service or API key is required. Fonts are served locally.

## Develop and check

Requires Node.js 22+ and pnpm 10.17.1.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm test
pnpm build
pnpm preview
```

Open the URL printed by Vite, including `/home/`. Navigation uses native section anchors. The globe supports dragging, rotation buttons, pause/play, and the system’s reduced-motion preference. Publications and theses have category/status filters; older publications and talks can be expanded.

## Publish to GitHub Pages from a branch

Source lives on `main`. Generated production files live at the root of `build`.

```sh
# Commit source changes, then build, check and publish:
pnpm deploy
```

The deploy script uses your existing Git credentials and configured author identity. It copies `dist/` into a temporary checkout of `build`, commits changed output, and pushes normally without rewriting history or switching your source checkout. A failed push leaves the remote branch unchanged; rerun to retry. Publishing requires write access to `origin`.

In **Settings → Pages**, select **Deploy from a branch**, **build**, **/ (root)**. This is a one-time setting. Vite’s base is `/home/`, matching this project’s GitHub Pages URL. `public/.nojekyll` disables Jekyll processing. Existing public CV/image/JSON URLs under `assets/` are preserved.

Live site: https://thibaud-c.github.io/home/

Pushing `main` alone does not publish. Run `pnpm deploy` for each release. No workflow or deployment secret is required. GitHub documents that commits pushed by Actions with `GITHUB_TOKEN` do not trigger branch-based Pages builds: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Content

Edit JSON in `src/assets/perso_data/`. Publication records accept a DOI, year, authors, type, venue, tags, and an optional illustration. Thesis groups contain `title`, `student`, and `ongoing` (false displays “Completed”).

September 2026 update:

- Five completed and three ongoing theses, transcribed from the supplied supervision screenshot. Green checks are interpreted as completed and orange markers as ongoing. Dates were omitted because their column headings were not visible. Student IDs are not published.
- Robin Holfelder and Steve Megaptche are provisionally grouped under master’s theses. Their clipped titles are marked with an ellipsis and `titleIncomplete: true`. Simon Herz’s full updated title was recovered from the university’s public thesis listing: https://online.uni-graz.at/kfu_online/wbAbs.showThesis?pThesisNr=102506&pOrgNr=14153.
- The German PhD title is translated as “From Mapping to Meaning: AI and Gamification for Public Engagement in GIS”.
- Latest publication verified with the publisher: Valdesera, Chassin & Pánek (10 June 2026), https://doi.org/10.5194/agile-giss-7-45-2026.

## Contact

thibaud.chassin@uni-graz.at
