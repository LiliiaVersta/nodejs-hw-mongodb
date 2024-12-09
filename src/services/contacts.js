import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async (userId, sortBy, sortOrder) => {
  return await ContactsCollection.find({ userId }).sort({
    [sortBy]: sortOrder,
  });
};
export const getContactById = async (contactId, userId) => {
  return await ContactsCollection.findOne({ _id: contactId, userId });
};

export const createContact = async (contactData) => {
  const newContact = await ContactsCollection.create(contactData);
  return newContact;
};

export const updateContact = async (contactId, updateFields, userId) => {
  const updatedContact = await ContactsCollection.findByIdAndUpdate(
    { _id: contactId, userId },
    updateFields,
    { new: true, runValidators: true },
  );
  return updatedContact;
};

export const deleteContact = async (contactId, userId) => {
  const result = await ContactsCollection.findByIdAndDelete({
    _id: contactId,
    userId,
  });
  return result;
};
