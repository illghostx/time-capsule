const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'capsules.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS capsules (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT NOT NULL,
    author     TEXT NOT NULL,
    message    TEXT NOT NULL,
    unlock_at  TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

module.exports = db;
