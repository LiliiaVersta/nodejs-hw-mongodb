import { PATH_DB } from '../constants/contacts.js';
import { promises as fs } from 'fs';

export const readContacts = async () => {
  try {
    const data = await fs.readFile(PATH_DB, 'utf8');

    const contacts = JSON.parse(data);

    if (Array.isArray(contacts) && contacts.length === 0) {
      console.log('Contacts list is empty.');
      return [];
    }

    return contacts;
  } catch (error) {
    console.error('Error reading contacts:', error);
    throw new Error('Failed to read contacts data');
  }
};
