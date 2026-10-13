# Time Capsule

A small web app where you write a message, pick a date in the future, and seal it. Until that date arrives, nobody can read it, including you.

I built this as a practice project for working with a real backend. The idea was simple enough to finish in a weekend, but it still needed a database, an API and some actual logic on the server.

**Live demo:** https://claude.ai/artifact/QXp7s6zhVtCh8gjEUx47KB

The demo is a browser-only version of the frontend. It saves capsules in your own browser, so they stay private to you and won't show up on other devices. The full version with the Express server and database is what's in this repo.

## How it works

The part I cared about most is that the locking happens on the server, not in the page. My first thought was to just hide the text with JavaScript until the date passed, but anyone could open dev tools and read it. So instead, the API checks the unlock time on every request. If the date hasn't passed, the response has `message: null` and the text never leaves the database.

When a capsule is still locked, the page shows a countdown. When it hits zero, the page asks the server again and the real message comes back.

Your capsules are in the **Vault** tab. Sealed ones are blurred with a timer, and opened ones show the full message.

## Running it locally

You need Node.js 18 or newer.

```bash
git clone https://github.com/illghostx/time-capsule.git
cd time-capsule
npm install
npm start
```

Then open http://localhost:3000.

The SQLite database file (`capsules.db`) is created automatically the first time the server starts.

## API

| Method | Route | What it does |
|--------|-------|--------------|
| GET | `/api/capsules` | Lists all capsules. `message` is `null` for locked ones. |
| GET | `/api/capsules/:id` | Returns a single capsule. |
| POST | `/api/capsules` | Creates one. Body: `title`, `author`, `message`, `unlockAt` (ISO date). |

The server rejects empty fields, text that is too long, invalid dates, and unlock times less than a minute away.

## Project layout

```
server.js        Express routes and the lock check
db.js            SQLite setup
public/
  index.html     Page structure
  style.css      Styling, light and dark theme
  app.js         Tabs, countdown, talking to the API
```

## Stack

Node.js, Express, SQLite (better-sqlite3), and plain HTML, CSS and JavaScript. There's no framework and no build step on purpose, so the whole thing is easy to read top to bottom.

## What I'd like to add

- Accounts, so capsules belong to a person instead of being public
- An email when a capsule opens
- Deploying it somewhere with a persistent database

## License

MIT
