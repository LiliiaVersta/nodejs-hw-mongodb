import { PATH_DB } from '../constants/contacts.js';
import { promises as fs } from 'fs';

export const writeContacts = async (updatedContacts) => {
  try {
    const jsonData = JSON.stringify(updatedContacts, null, 2);

    await fs.writeFile(PATH_DB, jsonData, 'utf8');

    console.log('Contacts successfully saved.');
  } catch (error) {
    console.error('Error writing contacts:', error);
    throw new Error('Failed to write contacts data');
  }
};
