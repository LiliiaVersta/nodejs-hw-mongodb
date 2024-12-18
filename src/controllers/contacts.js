import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

import createHttpError from 'http-errors';
// import cloudinary from '../utils/cloudinary.js';

import { uploadPhotoToCloudinary } from '../utils/uploadPhoto.js';

export const getAllContactsController = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 10;
    const sortBy = req.query.sortBy || 'name';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    const { contacts, totalItems } = await getAllContacts(
      req.user._id,
      page,
      perPage,
      sortBy,
      sortOrder,
    );

    res.status(200).json({
      status: 200,
      message: 'Successfully retrieved contacts!',
      data: {
        contacts,
        pagination: {
          page,
          perPage,
          totalItems,
          totalPages: Math.ceil(totalItems / perPage),
          hasPreviousPage: page > 1,
          hasNextPage: page < Math.ceil(totalItems / perPage),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
export const getContactByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = await getContactById(contactId, req.user._id);

    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

// export const uploadPhotoToCloudinary = async (file) => {
//   if (!file) return null;
//   const result = await cloudinary.uploader
//     .upload_stream({ resource_type: 'auto' }, (error, result) => {
//       if (error) throw createHttpError(500, 'Failed to upload photo');
//       return result.secure_url;
//     })
//     .end(file.buffer);
//   return result;
// };

export const createContactController = async (req, res, next) => {
  try {
    if (!Object.keys(req.body).length) {
      throw createHttpError(400, 'Request body cannot be empty');
    }
    const contactData = {
      ...req.body,
      userId: req.user._id,
    };

    // Загрузка фото в Cloudinary
    if (req.file) {
      const photoUrl = await uploadPhotoToCloudinary(req.file);
      contactData.photo = photoUrl;

      const newContact = await createContact(contactData);
      res.status(201).json({
        status: 201,
        message: 'Successfully created a contact!',
        data: newContact,
      });
    }
  } catch (err) {
    next(err);
  }
};

export const updateContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const updateFields = req.body;

    // Загрузка нового фото в Cloudinary
    if (req.file) {
      const photoUrl = await uploadPhotoToCloudinary(req.file);
      updateFields.photo = photoUrl;
    }
    const updatedContact = await updateContact(
      req.user._id,
      contactId,
      updateFields,
    );

    if (!updatedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: updatedContact,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteContactController = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const deletedContact = await deleteContact(req.user._id, contactId);

    if (!deletedContact) {
      throw createHttpError(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
