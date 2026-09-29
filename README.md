# Laura Mujica — website

Static HTML site hosted on Firebase Hosting (`lauramujica-fbc70`). The shared styling is in `css/styles.css` and navigation/interactive behavior is in `js/main.js`.

## Editing pages

Each view is a complete HTML file at the repository root. Edit `projects.html` for the project list and `project-volka.html` for the current case study. The homepage is `index.html`; other files are named after their view, such as `about.html` and `contact.html`.

`showPage('projects')` in the existing buttons and links opens `projects.html`. The Projects page is intentionally absent from the public menu at present; its direct local URL is `/projects.html`. Keep the menu and shared video modal consistent when changing their markup across pages.

For a local preview, run `python3 -m http.server 8000` in this folder and open `http://localhost:8000`. Firebase Hosting serves the files directly from this folder as configured in `firebase.json`. Publishing a GitHub commit alone does not deploy to Firebase.
