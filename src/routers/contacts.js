// src/routers/contacts.js

import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';

const router = express.Router();

// Роут для отримання всіх контактів
router.get('/', ctrlWrapper(getAllContactsController));

// Роут для отримання контакту за ID
router.get('/:contactId', ctrlWrapper(getContactByIdController));

// Роут для створення нового контакту
router.post('/', ctrlWrapper(createContactController));

// Роут для оновлення контакту за ID
router.patch('/:contactId', ctrlWrapper(updateContactController));

// Роут для видалення контакту за ID
router.delete('/:contactId', ctrlWrapper(deleteContactController));
export default router;
