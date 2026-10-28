# Facility portal

Golf course list and editor. Data stays in the browser.

## Setup

```bash
npm install
npm run dev
```


```bash
npm test          # Vitest
npm run test:e2e  # Playwright. First run: npx playwright install chromium
npm run build && npm run preview
```
I assumed we don't have to support Internet Explorer

## Reviewing failures

On the list page, **Review tools** toggles `demoFlags`.

- **Simulate delete failure** removes the card, then restores it and shows an error.
- **Simulate load failure** fails the list request.
- **Simulate image load failure** shows `/images/out-of-bounds.jpg` for every course photo that has a source.

## With more time

- An upload endpoint and API behind the same service.
- Visual regression against the Figma frames.

## AI usage

Built in Cursor with Grok 4.7, with the entire task as the initial prompt. Then I went through the structure of the code, questioned using plain CSS instead of Tailwind, and some useEffects, and concluded that everything was fine. Then I had it compare screenshots with Figma until it got close enough, and clicked around the app myself and fixed the things I thought were lacking. Like an image cropping functionality, reopening the image to crop by clicking it again, and a cancel button on the new course view.

The tests check that we can create a course and roll back a failed delete. I would also test the image upload with a crop, then reopening the crop modal and saving a different crop, if I wanted to be more thorough.
