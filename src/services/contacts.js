import { ContactsCollection } from '../db/models/contacts.js';

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  console.log('Fetched contacts from database:', contacts);
  return contacts;
};
export const getContactById = async (contactId) => {
  return await ContactsCollection.findById(contactId);
};

// Сервіс для створення нового контакту
export const createContact = async (contactData) => {
  const newContact = await ContactsCollection.create(contactData);
  return newContact;
};

// Сервіс для оновлення контакту
export const updateContact = async (contactId, updateFields) => {
  const updatedContact = await ContactsCollection.findByIdAndUpdate(
    contactId,
    updateFields,
    { new: true, runValidators: true }, // Повертає оновлений документ і враховує валідацію
  );
  return updatedContact; // Повертаємо оновлений документ або null, якщо його не було знайдено
};

// Сервіс для видалення контакту
export const deleteContact = async (contactId) => {
  const result = await ContactsCollection.findByIdAndDelete(contactId);
  return result; // Повертаємо видалений документ або null, якщо його не було знайдено
};
