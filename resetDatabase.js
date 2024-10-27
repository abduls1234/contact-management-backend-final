const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('contacts.db');

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS users");
  db.run("DROP TABLE IF EXISTS contacts");

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY, 
    email TEXT UNIQUE, 
    password TEXT, 
    emailVerified INTEGER DEFAULT 0, 
    emailVerificationCode INTEGER, 
    resetCode INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY, 
    user_id INTEGER, 
    name TEXT, 
    email TEXT UNIQUE, 
    phone TEXT, 
    address TEXT, 
    timezone TEXT, 
    created_at TEXT, 
    updated_at TEXT, 
    deleted INTEGER DEFAULT 0, 
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  // Seed some contacts
  const contacts = [
    { userId: 1, name: "Alice", email: "alice@example.com", phone: "1234567891", address: "123 Cherry St", timezone: "America/New_York" },
    { userId: 1, name: "Bob", email: "bob@example.com", phone: "1234567892", address: "456 Maple St", timezone: "America/Chicago" },
    { userId: 2, name: "Charlie", email: "charlie@example.com", phone: "1234567893", address: "789 Oak St", timezone: "America/Los_Angeles" }
  ];

  contacts.forEach(contact => {
    db.run("INSERT INTO contacts (user_id, name, email, phone, address, timezone, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))",
      [contact.userId, contact.name, contact.email, contact.phone, contact.address, contact.timezone], function(err) {
      if (err) {
        console.error("Error inserting contact:", err);
      } else {
        console.log("Contact inserted successfully, ID:", this.lastID);
      }
    });
  });

  console.log("Database schema reset and contacts seeded.");
});

db.close();
