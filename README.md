# Laura Mujica — website

Static HTML site hosted on Firebase Hosting (`lauramujica-fbc70`). The shared styling is in `css/styles.css` and navigation/interactive behavior is in `js/main.js`.

## Editing pages

The visible homepage and menu are in `index.html`. Each other view is a complete HTML file in its section folder under `pages/`. Edit `pages/projects/index.html` for the project list and `pages/projects/futurescape/index.html` or `pages/projects/boredrawr/index.html` for the case studies. Project pages can share `css/case-study.css` and use a project-specific stylesheet under `css/projects/`. Playground experiments live in `pages/playground/`.

The menu uses direct links to About, Services, Projects, and Contact. Existing buttons that call `showPage('projects')` open `/pages/projects/`. Keep the shared menu and video modal consistent when changing their markup across pages.

For a local preview, run `python3 -m http.server 8000` in this folder and open `http://localhost:8000`. Firebase Hosting serves the files directly from this folder as configured in `firebase.json`. Publishing a GitHub commit alone does not deploy to Firebase.

Case-study working sources live in `content/` and are excluded from Firebase Hosting. The website renders the approved standalone HTML pages in `pages/projects/`.
