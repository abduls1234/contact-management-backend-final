const Joi = require('joi');
const db = require('../../database/db');

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  timezone: Joi.string().required()
});

export default (req, res) => {
  console.log("Endpoint hit");
  if (req.method === 'POST') {
    console.log("POST request received:", req.body);

    const { contacts } = req.body;

    if (!contacts || !Array.isArray(contacts)) {
      console.error("No contacts provided or contacts is not an array");
      return res.status(400).json({ error: 'No contacts provided or contacts is not an array' });
    }

    const validatedContacts = contacts.filter(contact => {
      const { error } = contactSchema.validate(contact);
      if (error) {
        console.error("Validation error for contact:", contact, error);
      }
      return !error;
    });

    if (validatedContacts.length === 0) {
      console.error("No valid contacts provided");
      return res.status(400).json({ error: 'No valid contacts provided' });
    }

    let processedCount = 0;
    let skippedCount = 0;
    let updatedCount = 0;
    let insertedCount = 0;

    validatedContacts.forEach((contact, index, array) => {
      const { name, email, phone, address, timezone } = contact;

      db.get("SELECT * FROM contacts WHERE email = ?", [email], function(err, row) {
        if (err) {
          console.error("Error checking for existing contact:", err);
          return res.status(500).json({ error: err.message });
        }

        if (row) {
          // Contact exists, let's update it
          db.run("UPDATE contacts SET name = ?, phone = ?, address = ?, timezone = ?, updated_at = datetime('now') WHERE email = ?", 
            [name, phone, address, timezone, email], function(err) {
            if (err) {
              console.error("Error updating contact:", err);
              return res.status(500).json({ error: err.message });
            }
            console.log("Contact updated successfully:", email);
            updatedCount++;

            processedCount++;
            if (processedCount === array.length) {
              console.log("All contacts processed");
              res.status(200).json({ message: `Processed successfully. Inserted: ${insertedCount}, Updated: ${updatedCount}, Skipped: ${skippedCount}` });
            }
          });
        } else {
          // Contact does not exist, insert it
          db.run("INSERT INTO contacts (user_id, name, email, phone, address, timezone, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))", 
            [req.body.userId, name, email, phone, address, timezone], function(err) {
            if (err) {
              console.error("Error inserting contact:", err);
              return res.status(500).json({ error: err.message });
            }
            console.log("Contact inserted successfully, ID:", this.lastID);
            insertedCount++;

            processedCount++;
            if (processedCount === array.length) {
              console.log("All contacts processed");
              res.status(200).json({ message: `Processed successfully. Inserted: ${insertedCount}, Updated: ${updatedCount}, Skipped: ${skippedCount}` });
            }
          });
        }
      });
    });

  } else {
    res.status(405).end();
  }
};
