# 🐹 GopherGrind

A mobile-first, Duolingo-style practice app for Go and software engineering interview prep. Built to keep coding fundamentals sharp in short sessions on the go.

## Features

- **Coding challenges** across Go basics, algorithms, system design, architecture and CS concepts, from "Hello, Gopher!" to Two Sum, binary search and Kadane's algorithm
- **Mini lessons** with examples before each challenge
- **Hints and solutions** that reveal step by step
- **Test in Go Playground**: opens your code at go.dev/play to run it with the real Go compiler
- **Flashcards** for core concepts (Go, algorithms, system design, architecture)
- **XP, levels and streaks**, with auto-advance to the next challenge
- **Bookmarks**: save challenges to revisit later
- **Progress saved** in the browser with localStorage

## Tech stack

React 18 · Vite · JavaScript · CSS (mobile-first, iPhone safe-area aware)

## Run it locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints. On a phone, use `npm run dev -- --host` and open the network URL.

## AI tutor (optional)

The 🤖 AI button can ask an LLM for a hint. To keep API keys out of the browser, it calls a small backend you provide: set `VITE_TUTOR_URL` in a `.env` file to an endpoint that accepts `{ "prompt": "..." }` and returns `{ "text": "..." }`. Without it, the app works normally and the button points you to the built-in hints.
