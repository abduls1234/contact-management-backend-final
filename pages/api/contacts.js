const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('contacts.db');

const Joi = require('joi');
const moment = require('moment-timezone');

const contactSchema = Joi.object({
  userId: Joi.number().integer().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
  timezone: Joi.string().required()
});

export default async (req, res) => {
  const { method, body, query } = req;

  switch (method) {
    case 'GET':
      try {
        const filters = [];
        const values = [];
        if (query.name) {
          filters.push("name LIKE ?");
          values.push(`%${query.name}%`);
        }
        if (query.email) {
          filters.push("email = ?");
          values.push(query.email);
        }
        if (query.startDate && query.endDate) {
          filters.push("created_at BETWEEN ? AND ?");
          values.push(query.startDate, query.endDate);
        }
        const filterString = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
        const orderBy = query.sort ? `ORDER BY ${query.sort}` : '';

        db.serialize(() => {
          db.all(`SELECT * FROM contacts ${filterString} ${orderBy}`, values, (err, rows) => {
            if (err) {
              console.error("Error fetching contacts:", err);
              res.status(500).json({ error: err.message });
              return;
            }
            const userTimezone = query.timezone;
            rows = rows.map(contact => ({
              ...contact,
              created_at: moment.tz(contact.created_at, userTimezone).format(),
              updated_at: moment.tz(contact.updated_at, userTimezone).format()
            }));
            console.log("Contacts fetched successfully:", rows);
            res.status(200).json({ contacts: rows });
          });
        });
      } catch (error) {
        console.error("Unexpected error in GET:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;

    case 'POST':
      try {
        const { error } = contactSchema.validate(body);
        if (error) {
          console.error("Validation error:", error);
          res.status(400).json({ error: error.details[0].message });
          return;
        }
        const { userId, name, email, phone, address, timezone } = body;
        db.run("INSERT INTO contacts (user_id, name, email, phone, address, timezone, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))", 
          [userId, name, email, phone, address, timezone], function(err) {
          if (err) {
            console.error("Error inserting contact:", err);
            res.status(500).json({ error: err.message });
            return;
          }
          console.log("Contact inserted successfully, ID:", this.lastID);
          res.status(201).json({ id: this.lastID });
        });
      } catch (error) {
        console.error("Unexpected error in POST:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;

    case 'PUT':
      try {
        const { id, updatedName, updatedEmail, updatedPhone, updatedAddress, updatedTimezone } = body;
        db.run("UPDATE contacts SET name = ?, email = ?, phone = ?, address = ?, timezone = ?, updated_at = datetime('now') WHERE id = ?", 
          [updatedName, updatedEmail, updatedPhone, updatedAddress, updatedTimezone, id], function(err) {
          if (err) {
            console.error("Error updating contact:", err);
            res.status(500).json({ error: err.message });
            return;
          }
          console.log("Contact updated successfully, ID:", id);
          res.status(200).json({ message: 'Contact updated successfully' });
        });
      } catch (error) {
        console.error("Unexpected error in PUT:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;

    case 'DELETE':
      try {
        const { contactId } = body;
        db.run("UPDATE contacts SET deleted = 1 WHERE id = ?", [contactId], function(err) {
          if (err) {
            console.error("Error deleting contact:", err);
            res.status(500).json({ error: err.message });
            return;
          }
          console.log("Contact deleted successfully, ID:", contactId);
          res.status(200).json({ message: 'Contact deleted successfully' });
        });
      } catch (error) {
        console.error("Unexpected error in DELETE:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
      break;

    default:
      res.status(405).end();
      break;
  }
};
