# ✦ QuizOrbit — Coaching-wise Quiz Website

A lightweight, responsive test library that automatically lists HTML quiz files by coaching folder. Deploy the **same repository** to both Vercel and Render.

## Features

- Automatically discovers coaching folders and any number of `.html` tests at build time.
- Coaching folder name = coaching card name; HTML filename = test title.
- Search across coaching and test names.
- Opens the original HTML quiz without converting or modifying it.
- Mobile-friendly dark interface; no database, API key, or paid service required for the static site.
- Folder and test names can contain spaces, Hindi, and other Unicode characters.

## Folder structure

```text
public/
├── index.html
├── tests.json                 # generated during build; do not edit manually
└── tests/
    ├── Demo Coaching/
    │   └── Rajasthan Geography Demo.html
    ├── Vision IAS/
    │   ├── Polity Test 01.html
    │   └── Economy Test 02.html
    └── Vajiram and Ravi/
        └── Geography Mock.html
scripts/
└── build-manifest.js
```

The repository includes your supplied quiz as a working demo at `public/tests/Demo Coaching/Rajasthan Geography Demo.html`. You can keep it, replace it, or delete it.

## Add coaching folders and tests

1. Open the repository in GitHub (or locally).
2. Under `public/tests/`, create a folder with any coaching name, e.g. `Vision IAS`.
3. Upload one or more quiz `.html` files directly into that folder.
4. Commit/push the changes. Vercel/Render rebuilds the site and the new coaching/tests appear automatically.
5. To add another coaching, repeat with another folder. There is no hard-coded coaching list or fixed test limit.

**Important:** this is a static website. You add test files through GitHub/repository commits, not through a visitor-facing upload button. A file uploaded from your computer into the deployed website would require a backend/storage service, which is intentionally not part of this simple free static setup.

## Deploy to Vercel

1. Push this entire repository to GitHub.
2. In Vercel, choose **Add New → Project** and import the GitHub repository.
3. Use these settings (the included `vercel.json` also defines them):
   - Framework preset: **Other**
   - Build command: `npm run build`
   - Output directory: `public`
   - Install command: leave default (there are no dependencies)
4. Click **Deploy**.

## Deploy to Render

1. In Render, choose **New → Static Site** and connect the same GitHub repository.
2. Set:
   - Build command: `npm run build`
   - Publish directory: `public`
3. Click **Create Static Site**.

The included `render.yaml` records these settings. You can deploy the same GitHub repository to both platforms; each will build its own copy of the static site.

## Test locally

Requires Node.js 18 or newer. In the repository folder:

```bash
npm run build
npx serve public
```

Then open the local URL printed by `serve`. Do not open `index.html` directly as a `file://` URL because browsers block its `fetch('/tests.json')` request in that mode.

## Notes

- Each test must be a working, self-contained `.html` quiz. The library opens it as-is in the same tab.
- External fonts/icons used by a test may require internet access.
- If you add or rename a test, rebuild/redeploy so `public/tests.json` refreshes.
- No test-count limit is coded into the site; practical hosting/repository file-size limits still apply.
