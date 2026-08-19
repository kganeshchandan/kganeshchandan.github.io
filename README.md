# Ganesh Chandan — Intelligence Atlas

A dependency-free personal website built with HTML, CSS, and JavaScript.

## Pages

- `index.html` — full-screen interactive knowledge graph connecting domains, projects, publications, and institutions.
- `timeline.html` — chronological record of all 28 account-owned public GitHub repositories.
- `resume.html` — résumé overview and embedded PDF.
- `contact.html` — email and professional links.

## Atlas interaction

The home-page graph supports animated node and edge spawning, dragging, filtering, search, keyboard selection, contextual detail panels, and reduced-motion preferences. It uses native SVG and browser APIs without a graph library.

## Run locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Deploy

The repository can be published directly from its root with GitHub Pages.

## Evidence archive

The factual source material used by the website is preserved in [`evidence/`](evidence/README.md). It includes the reconciled dossier, all 28 account-owned public repositories, and commit-attributed evidence for nine externally hosted organization or collaboration repositories.
