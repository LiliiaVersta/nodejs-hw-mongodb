import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async (page, perPage, sortBy, sortOrder) => {
  const skip = (page - 1) * perPage;

  const [contacts, totalItems] = await Promise.all([
    ContactsCollection.find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
    ContactsCollection.countDocuments(),
  ]);

  return { contacts, totalItems };
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
