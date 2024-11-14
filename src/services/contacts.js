import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  console.log('Fetched contacts from database:', contacts);
  return contacts;
};
export const getContactById = async (contactId) => {
  return await ContactsCollection.findById(contactId);
};
