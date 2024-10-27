const db = require('../../database/db');
const { Parser } = require('json2csv');

export default async (req, res) => {
  console.log("Download endpoint hit");
  try {
    db.all("SELECT * FROM contacts", (err, rows) => {
      if (err) {
        console.error("Error retrieving contacts:", err);
        return res.status(500).json({ error: err.message });
      }
      
      const fields = ['id', 'user_id', 'name', 'email', 'phone', 'address', 'timezone', 'created_at', 'updated_at'];
      const opts = { fields };
      
      try {
        const parser = new Parser(opts);
        const csv = parser.parse(rows);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
        return res.status(200).send(csv);
      } catch (err) {
        console.error("Error generating CSV:", err);
        return res.status(500).json({ error: err.message });
      }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
