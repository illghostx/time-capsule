# time-capsule
A full stack time capsule app: write a message to the future and the server keeps it sealed until the unlock date. Built with Node.js, Express and SQLite.
⏳ Time Capsule
Write a message to the future. Pick an unlock date, seal it, and the server refuses to
reveal the message until that moment — even if someone calls the API directly.
Features
Create capsules with a title, author, message and unlock date
Live countdown on sealed capsules; they open automatically when time is up
Backend-enforced locking (the message is never sent to the client early)
Input validation, XSS-safe rendering, dark/light theme
Zero build step: Express + SQLite + vanilla JS
Where do I find my capsule?
Open the 🗄️ Vault tab. Every capsule you seal lands there:
🔒 Sealed capsules show a live countdown and a blurred placeholder.
🔓 Opened capsules (green border) show the full message once the unlock time passes. The page refreshes itself at that moment, no reload needed.
Tech stack
Layer	Tech
Backend	Node.js, Express
Database	SQLite (better-sqlite3)
Frontend	HTML, CSS, vanilla JavaScript
Run it
```bash
npm install
npm start
# open http://localhost:3000
```
API
Method	Route	Description
GET	`/api/capsules`	List capsules (`message` is `null` if locked)
GET	`/api/capsules/:id`	Get one capsule
POST	`/api/capsules`	Create `{title, author, message, unlockAt}`
Deploy it live (free)
Push this repo to GitHub.
On render.com choose New > Web Service and connect the repo.
Build command: `npm install` · Start command: `npm start`
Click deploy. You get a public URL like `https://time-capsule.onrender.com`.
> Free hosts reset the disk on redeploy, so SQLite data may be wiped. For permanent storage, add a persistent disk or swap SQLite for Postgres.
Ideas to extend
User accounts (JWT) so capsules are private
Email the author when their capsule unlocks (node-cron + nodemailer)
Password-protected capsules, image attachments
Deploy to Render / Railway
