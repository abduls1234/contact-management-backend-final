const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('contacts.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password TEXT, emailVerified INTEGER DEFAULT 0)");
  db.run("CREATE TABLE IF NOT EXISTS contacts (id INTEGER PRIMARY KEY, user_id INTEGER, name TEXT, email TEXT UNIQUE, phone TEXT, address TEXT, timezone TEXT, created_at TEXT, updated_at TEXT)");
});

module.exports = db;
