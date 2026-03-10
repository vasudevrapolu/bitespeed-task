const express = require("express");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.post("/identify", async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    // Find contacts with same email or phone
    const contacts = await prisma.contact.findMany({
      where: {
        OR: [
          { email: email || undefined },
          { phoneNumber: phoneNumber || undefined }
        ]
      }
    });

    // If no contacts exist → create primary contact
    if (contacts.length === 0) {
      const newContact = await prisma.contact.create({
        data: {
          email: email || null,
          phoneNumber: phoneNumber || null,
          linkPrecedence: "primary"
        }
      });

      return res.status(200).json({
        contact: {
          primaryContactId: newContact.id,
          emails: email ? [email] : [],
          phoneNumbers: phoneNumber ? [phoneNumber] : [],
          secondaryContactIds: []
        }
      });
    }

    // Find primary contact
    let primaryContact =
      contacts.find(c => c.linkPrecedence === "primary") || contacts[0];

    const emails = new Set();
    const phoneNumbers = new Set();
    const secondaryContactIds = [];

    contacts.forEach(contact => {
      if (contact.email) emails.add(contact.email);
      if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber);

      if (contact.linkPrecedence === "secondary") {
        secondaryContactIds.push(contact.id);
      }
    });

    if (email) emails.add(email);
    if (phoneNumber) phoneNumbers.add(phoneNumber);

    res.status(200).json({
      contact: {
        primaryContactId: primaryContact.id,
        emails: Array.from(emails),
        phoneNumbers: Array.from(phoneNumbers),
        secondaryContactIds: secondaryContactIds
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// IMPORTANT for Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});