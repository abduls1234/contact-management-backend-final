const formidable = require('formidable');
const csvParse = require('csv-parse');
const Joi = require('joi');
const db = require('../../database/db');

const csvSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  timezone: Joi.string().required()
});

export default async (req, res) => {
  console.log("CSV upload endpoint hit");

  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const form = new formidable.IncomingForm({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      return res.status(500).json({ error: err.message });
    }
    console.log("Form parsed successfully:", files);

    if (!files.csvfile) {
      return res.status(400).json({ error: 'CSV file is missing' });
    }

    csvParse(files.csvfile.filepath, { columns: true }, async (err, records) => {
      if (err) {
        console.error("Error parsing CSV:", err);
        return res.status(500).json({ error: err.message });
      }

      const validatedContacts = records.filter(record => {
        const { error } = csvSchema.validate(record);
        if (error) {
          console.error("Validation error for record:", record, error);
        }
        return !error;
      });

      if (validatedContacts.length === 0) {
        console.error("No valid contacts in CSV");
        return res.status(400).json({ error: 'No valid contacts in CSV' });
      }

      try {
        for (const contact of validatedContacts) {
          const { name, email, phone, address, timezone } = contact;

          const row = await new Promise((resolve, reject) => {
            db.get("SELECT * FROM contacts WHERE email = ?", [email], (err, row) => {
              if (err) return reject(err);
              resolve(row);
            });
          });

          if (row) {
            await new Promise((resolve, reject) => {
              db.run("UPDATE contacts SET name = ?, phone = ?, address = ?, timezone = ?, updated_at = datetime('now') WHERE email = ?", 
                [name, phone, address, timezone, email], err => {
                if (err) return reject(err);
                console.log("Contact updated successfully:", email);
                resolve();
              });
            });
          } else {
            await new Promise((resolve, reject) => {
              db.run("INSERT INTO contacts (user_id, name, email, phone, address, timezone, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))", 
                [fields.userId, name, email, phone, address, timezone], err => {
                if (err) return reject(err);
                console.log("Contact inserted successfully:", email);
                resolve();
              });
            });
          }
        }

        console.log("All contacts processed");
        return res.status(200).json({ message: 'All contacts processed successfully' });
      } catch (err) {
        console.error("Error processing contacts:", err);
        return res.status(500).json({ error: err.message });
      }
    });
  });
};
