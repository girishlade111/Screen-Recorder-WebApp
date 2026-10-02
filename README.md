# Screen Recorder WebApp

A lightweight browser-based screen recording app. Capture your screen, a window, or a browser tab — plus optional microphone audio — then preview the recording and download it locally as a WebM video. Everything runs 100% client-side; no server, no uploads, no sign-up.

## Features

- Screen / window / tab capture via the `getDisplayMedia` API
- Optional microphone audio recording alongside the screen
- Live preview of the recorded clip
- One-click download as `.webm`
- Privacy-first: recordings never leave the browser

## Tech Stack

- HTML5, CSS3, vanilla JavaScript
- MediaRecorder + getDisplayMedia Web APIs
- No build step, no dependencies

## Quick Start

1. Open `index.html` in a modern browser (Chrome/Edge/Firefox recommended).
2. Click **Start Recording**, pick the screen/window/tab to share.
3. Click **Stop** to finish — preview the clip and hit **Download** to save the `.webm` file.

## Project Structure

- `index.html` — app markup and layout
- `styles.css` — styling
- `script.js` — recording, preview, and download logic
- `LICENSE` — license terms

## Deploy Notes

Static site — deploy the repo as-is to GitHub Pages or any static host. No environment variables or build commands required.

---

Built by Girish Lade — https://ladestack.in
