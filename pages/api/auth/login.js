const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../../database/db');

export default async (req, res) => {
  if (req.method === 'POST') {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }
      const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
      res.status(200).json({ token });
    });
  } else {
    res.status(405).end();
  }
};
