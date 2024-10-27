const bcrypt = require('bcrypt');
const db = require('../../../database/db');

export default async (req, res) => {
  if (req.method === 'POST') {
    const { email, resetCode, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.run("UPDATE users SET password = ? WHERE email = ? AND resetCode = ?", [hashedPassword, email, resetCode], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(200).json({ message: 'Password updated successfully' });
    });
  } else {
    res.status(405).end();
  }
};
