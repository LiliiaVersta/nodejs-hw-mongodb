import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async (
  userId,
  page,
  perPage,
  sortBy,
  sortOrder,
) => {
  const skip = (page - 1) * perPage;

  const [contacts, totalItems] = await Promise.all([
    ContactsCollection.find({ userId })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
    ContactsCollection.countDocuments({ userId }),
  ]);

  return { contacts, totalItems };
};
export const getContactById = async (contactId, userId) => {
  return await ContactsCollection.findOne({ _id: contactId, userId });
};

export const createContact = async (contactData) => {
  const newContact = await ContactsCollection.create(contactData);
  return newContact;
};

export const updateContact = async (userId, contactId, updateFields) => {
  return await ContactsCollection.findOneAndUpdate(
    { _id: contactId, userId },
    updateFields,
    { new: true, runValidators: true },
  );
};
export const deleteContact = async (userId, contactId) => {
  return await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
};
