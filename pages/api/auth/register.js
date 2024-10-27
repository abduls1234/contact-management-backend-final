const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../../database/db');

export default async (req, res) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    console.log("Received request to register:", email);

    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      if (row) {
        res.status(400).json({ error: 'Email already exists' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Hashed Password:", hashedPassword);

      db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword], function(err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        const token = jwt.sign({ userId: this.lastID }, 'your_secret_key', { expiresIn: '1h' });
        res.status(201).json({ token });
      });
    });
  } else {
    res.status(405).end();
  }
};
