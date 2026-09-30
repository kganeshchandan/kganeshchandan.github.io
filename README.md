# Ganesh Chandan — Intelligence Atlas

A dependency-free personal website built with HTML, CSS, and JavaScript.

## Pages

- `index.html` — full-screen interactive knowledge graph connecting domains, projects, publications, and institutions.
- `timeline.html` — chronological record of all 28 account-owned public GitHub repositories.
- `resume.html` — résumé overview and embedded PDF.
- `contact.html` — email and professional links.

## Atlas interaction

The home-page graph lives in `atlas.js`; the rest of the site's behaviour is in `script.js`. It uses native SVG and browser APIs without a graph library.

- Two layouts: a force-directed network with shaded regions for each chapter of work, and a timeline with one lane per kind of node. Switch with the toggle or `T`.
- A guided tour (`P`) that walks through the main story with camera moves and captions.
- Hover or focus a node for a quick card; click for the detail panel; shift-click a second node to trace how the two connect.
- Domains and institutions can fan out their public repositories as extra nodes.
- Every node has a shareable link (`index.html#molgpt`); the panel's "Copy link" button copies it.
- Curved edges that draw in on load, travelling particles on the selection, captions that appear when zoomed in, a minimap, pinch zoom, arrow-key travel between nodes and a shortcuts sheet (`?`).
- Filtering, fuzzy search across graph items and all public repositories, and reduced-motion support throughout.

The interface uses a consistent Gruvbox Dark Hard Material palette across every page.

## Run locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Deploy

The repository can be published directly from its root with GitHub Pages.

## Evidence archive

The factual source material used by the website is preserved in [`evidence/`](evidence/README.md). It includes the reconciled dossier, all 28 account-owned public repositories, and commit-attributed evidence for nine externally hosted organization or collaboration repositories.
