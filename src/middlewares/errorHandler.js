// src/middlewares/errorHandler.js

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500; // Якщо статус помилки не вказано, використовуйте 500
  const message = err.message || 'Something went wrong';
  const data = err.data || null;

  res.status(status).json({
    status,
    message,
    data,
  });
};
