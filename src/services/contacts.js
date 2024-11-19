import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  console.log('Fetched contacts from database:', contacts);
  return contacts;
};
export const getContactById = async (contactId) => {
  return await ContactsCollection.findById(contactId);
};

export const createContact = async (contactData) => {
  const newContact = await ContactsCollection.create(contactData);
  return newContact;
};

export const updateContact = async (contactId, updateFields) => {
  const updatedContact = await ContactsCollection.findByIdAndUpdate(
    contactId,
    updateFields,
    { new: true, runValidators: true },
  );
  return updatedContact;
};

export const deleteContact = async (contactId) => {
  const result = await ContactsCollection.findByIdAndDelete(contactId);
  return result;
};
