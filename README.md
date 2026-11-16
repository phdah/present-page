# Present page

A small, playful, mobile-first birthday surprise hosted with GitHub Pages.

## Run locally

Open \`index.html\` in a browser, or run a static server from the repository root:

\`\`\`sh
python3 -m http.server 8000
\`\`\`

Then open http://localhost:8000/ .

## Behavior

- Landing screen asks for a six-digit code.
- Correct code: \`961121\` (birthday in YYMMDD format).
- Wrong or incomplete code: an accessible error message, no navigation.
- Correct code shows a separate success screen. The later horse/Málaga reveal has **not yet been implemented**.
- Refreshing the page returns to the gate.

**Security note:** This is deliberately not real authentication. Anyone can read the code or bypass the UI in a public static repository. Do not store private information behind this gate.

## Tests

\`\`\`sh
node --check app.js
node --test tests/gate.test.mjs
\`\`\`

No JavaScript dependencies or build tooling are required.

## Publish

The workflow in \`.github/workflows/pages.yml\` runs the tests and deploys the static site on pushes to \`main\` after GitHub Pages is enabled.

For a new repository, go to **Settings → Pages → Build and deployment → Source → GitHub Actions** if deployment does not start automatically. The expected default public URL after a successful deployment is:

https://phdah.github.io/present-page/

Do not write the URL on the physical gift card until you have confirmed it is live and the entry screen works on a phone.

## Next step

Replace the success placeholder with the animated, scroll-based riding-trip reveal. Keep all trip details conditional, not a confirmed booking.
