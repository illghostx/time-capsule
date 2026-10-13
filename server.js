const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Turn a DB row into API output. The message is ONLY included once unlocked.
function toPublic(row) {
  const unlocked = new Date(row.unlock_at).getTime() <= Date.now();
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    createdAt: row.created_at,
    unlockAt: row.unlock_at,
    locked: !unlocked,
    message: unlocked ? row.message : null,
  };
}

// List all capsules (newest first)
app.get('/api/capsules', (req, res) => {
  const rows = db.prepare('SELECT * FROM capsules ORDER BY id DESC').all();
  res.json(rows.map(toPublic));
});

// Get one capsule
app.get('/api/capsules/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM capsules WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Capsule not found' });
  res.json(toPublic(row));
});

// Create a capsule
app.post('/api/capsules', (req, res) => {
  const { title, author, message, unlockAt } = req.body || {};

  if (![title, author, message, unlockAt].every((v) => typeof v === 'string' && v.trim())) {
    return res.status(400).json({ error: 'title, author, message and unlockAt are required' });
  }
  if (title.length > 80 || author.length > 40 || message.length > 2000) {
    return res.status(400).json({ error: 'Title max 80, author max 40, message max 2000 characters' });
  }
  const when = new Date(unlockAt);
  if (Number.isNaN(when.getTime())) {
    return res.status(400).json({ error: 'unlockAt is not a valid date' });
  }
  if (when.getTime() <= Date.now() + 60 * 1000) {
    return res.status(400).json({ error: 'Unlock date must be at least 1 minute in the future' });
  }

  const info = db
    .prepare('INSERT INTO capsules (title, author, message, unlock_at) VALUES (?, ?, ?, ?)')
    .run(title.trim(), author.trim(), message.trim(), when.toISOString());

  const row = db.prepare('SELECT * FROM capsules WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(toPublic(row));
});

app.listen(PORT, () => console.log(`Time Capsule running at http://localhost:${PORT}`));
