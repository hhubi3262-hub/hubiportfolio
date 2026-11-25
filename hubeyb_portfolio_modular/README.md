# Hubeyb Awol Mohammed — Modular Portfolio

## Folder structure

```text
hubeyb_portfolio_modular/
├── index.html                 # Page structure and content
├── assets/
│   ├── css/
│   │   └── styles.css          # All portfolio styles and responsive rules
│   ├── images/
│   │   └── profile.png         # Profile photo (extension may be .jpg)
│   └── js/
│       ├── three-scene.js      # Interactive Three.js neural sphere
│       └── main.js             # Navigation, theme, projects, form, animations
└── README.md
```

## Run locally

1. Extract this ZIP file.
2. Open the `hubeyb_portfolio_modular` folder in VS Code.
3. Start a local server (recommended: VS Code Live Server).
4. Open the local URL provided by Live Server.

A local server is recommended because the 3D scene uses JavaScript modules and imports Three.js from jsDelivr. Internet access is required for that external Three.js module and any externally hosted fonts.

## Editing guide

- Change page text and section structure in `index.html`.
- Change colors, layout, typography, and responsive styling in `assets/css/styles.css`.
- Change the 3D neural sphere in `assets/js/three-scene.js`.
- Change navigation, theme toggle, project interactions, scroll effects, and contact form behavior in `assets/js/main.js`.
- Replace `assets/images/profile.png` with your own image, keeping the same filename or updating the image paths in `index.html`.

This is a modular static frontend. The contact form opens the visitor's email application; it does not store messages on a backend.
