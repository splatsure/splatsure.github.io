# SplatSuRe: Selective Super-Resolution for Multi-view Consistent 3D Gaussian Splatting

Website source for [SplatSuRe](https://splatsure.github.io/).

Built as plain HTML, CSS and JavaScript — no framework and no build step, so what is in the
repository is what the browser gets. The notes below cover the parts that are not obvious from
reading the markup.

---

## Performance

- **Purged Bulma.** Only the rules this page actually uses are shipped — 14 KB of the
  framework's ~200 KB. jQuery, bulma-carousel and the full Font Awesome bundle are gone
  entirely. Because the purge is per-site, each of these pages carries a slightly different
  subset.
- **Self-hosted, subset fonts.** Noto Sans is served as a variable font subset from this repo
  rather than from Google's CDN, which removed a third-party round-trip before any text could
  paint. The icon fonts are subset to only the glyphs in use — 12 of Font Awesome's ~2000
  and Academicons' ~150, about 3 KB in total. Regenerate with `tools/build-webfonts.sh`, which
  scans the markup and JavaScript for the classes actually referenced, so no list needs
  maintaining by hand, and refuses to finish if a glyph is missing an outline or a stylesheet
  rule.
- **Media loaded on demand.** The results carousel's images are promoted from `loading="lazy"`
  only once the carousel itself is on screen — an off-screen slide never enters the viewport by
  scrolling, so the browser would otherwise defer it indefinitely and the first step round the
  ring would show empty boxes. The one video here is the hero comparison slider, which is above
  the fold and eager by design: the slider initialises from its own `onplay` handler.
- **Space reserved before decode.** Images and canvases declare their source aspect ratio, so
  nothing shifts as media arrives.
- **`cache_bust.py`** stamps a version query on every local asset — in the HTML, in `url()`
  inside our own stylesheets, and in versioned URLs built in JavaScript. Covering all three
  matters: a `<link rel="preload">` and the `@font-face` `url()` it preloads must agree
  byte-for-byte, query string included, or the browser treats them as two resources and the
  preload is wasted.

## Light and dark themes

- **`theme.css` + `theme-switcher.js`.** Every colour resolves through a custom property, so a
  theme is one attribute on `<html>` rather than a cascade of overrides. The sixth footer icon
  toggles it and the choice persists in `localStorage`.
- **Light is the default, deliberately.** There is no `prefers-color-scheme` detection: these
  are paper pages usually reached from a link and read once, and the light rendering is the one
  the figures were authored against. Dark is opt-in.
- **No flash.** A small inline script at the very top of `<head>` sets the theme before the
  first paint. A deferred file would let the page paint light and then correct itself.
- **Dark is a palette, not an inversion.** Inverting a page turns drop shadows into glows and
  makes the link blue vibrate. The dark values are chosen against the surface each one actually
  sits on, and every text colour clears WCAG AA with room to spare.
- **Paper figures get a light card in dark mode.** Plots and tables lifted from the paper have a
  white background baked into the image; on a dark page they would become glowing rectangles
  whose black text you had to read out of a bright panel. They are set on a light card instead,
  so the white reads as a sheet of paper laid on the page — which is how the figure looks in the
  PDF anyway. Inverting them was rejected: it would wreck the colour-coded cells and highlight
  swatches that carry meaning.

## Accessibility

- Landmarks and a heading outline that follows the document, one `<h1>` per page.
- Every image has a meaningful `alt`; every link and control has a discernible name.
- Visible focus rings on everything focusable, in both themes.
- `prefers-reduced-motion` disables the carousel animation, the hover polish and the theme
  transition. The carousel checks `matchMedia` in JavaScript as well, because its transition is
  set as an inline style and a stylesheet media query cannot override one.
- Long words wrap rather than overflow: Bulma sets `html { overflow-x: hidden }`, so an
  overflowing word is clipped and unreachable rather than merely off-screen.
- Display equations shrink to fit a narrow screen instead of scrolling. MathJax writes its own
  `font-size` inline, so the scaling is a transform on the inner box; a scroll container is
  retained underneath for anything the scaling cannot rescue, so nothing is ever unreachable.

## Structure

- **Results carousel** (`slideshow.js`, `slideshow.css`)  
  A dependency-free replacement for bulma-carousel, which needed jQuery and ~40 KB of library to do this. The track is a true ring: each slide is positioned by its *cyclic* distance from the active one, so last-to-first animates as one step rather than snapping across a seam. Draggable by mouse and touch; deliberately no auto-advance, since yanking a result away mid-inspection is worse than a click. Only the visible slide decodes — the rest are paused via `IntersectionObserver`. On phones the peek is dropped so the active slide takes the full column, and the neighbours sit off-screen behind a clip rather than being faded out, so a step is one transform on one curve instead of a fade and a slide fighting each other.
- **Before/after image sliders** (`script.js`)  
  Draggable split comparisons. Discovered by class rather than by a hand-maintained list of ids, so the list cannot drift out of sync with the markup. The container's aspect ratio is declared inline per slider from its own image dimensions, so the box is reserved before the image decodes and stepping the carousel does not jump.
- **Video comparison sliders** (`video_comparison.js`)  
  Side-by-side video with a draggable divider, drawn to a canvas. The draw loop runs only while the canvas is on screen and the clip is playing, so two sliders do not burn CPU for the whole page. The backing store is capped at 2× DPR — beyond that the extra pixels cost real per-frame time for no perceptible gain. The container is sized to the canvas, so the rounded, shadowed surface always coincides with the picture.
- **In-page PDF viewer** (`pdf-modal.js`) — opens any PDF link in a focus-trapped overlay,
  loading PDF.js from cdnjs on first use rather than shipping it, and falling back to the
  browser's own viewer on mobile.

## Local development

```sh
./run_server.sh          # serve at http://localhost:8000
python3 cache_bust.py    # dry run: show which asset versions would change
python3 cache_bust.py --apply
tools/build-webfonts.sh  # regenerate the font subsets after adding an icon
```
