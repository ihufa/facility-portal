# Facility portal

Golf course list and editor. Data stays in the browser.

## Setup

```bash
npm install
npm run dev
```

Vite prints the URL, usually http://127.0.0.1:5173.

```bash
npm test          # Vitest
npm run test:e2e  # Playwright. First run: npx playwright install chromium
npm run build && npm run preview
```

## Reviewing failures

On the list page, **Review tools** toggles `demoFlags`.

- **Simulate delete failure** removes the card, then restores it and shows an error.
- **Simulate load failure** fails the list request.
- **Simulate image load failure** shows `/images/out-of-bounds.jpg` for every course photo that has a source.

## With more time

- An upload endpoint and API behind the same service.
- Visual regression against the Figma frames.

## AI usage

Built in Cursor with Grok 4.7.
