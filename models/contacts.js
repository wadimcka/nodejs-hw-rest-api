const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const buffer = await fs.readFile(contactsPath);
  const allContacts = JSON.parse(buffer);
  return allContacts;
};

async function getContactById(contactId) {
  const allContacts = await listContacts();
  const contact = allContacts.find((contact) => contact.id === contactId);
  return contact || null;
}

const removeContact = async (contactId) => {
  const allContacts = await listContacts();
  const contact = allContacts.findIndex((contact) => contact.id === contactId);
  if (contact === -1) {
    return null;
  }
  const [removedContact] = allContacts.splice(contact, 1);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return [removedContact];
};

const addContact = async (body) => {
  const allContacts = await listContacts();
  const newContact = {
    id: crypto.randomUUID(),
    ...body,
  };
  allContacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const allContacts = await listContacts();
  const index = allContacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  allContacts[index] = { id: contactId, ...body };
  console.log(allContacts[index]);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return allContacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
