// export const validateBody = (schema) => {
//   return (req, res, next) => {
//     const { error } = schema.validate(req.body);
//     if (error) {
//       return res.status(400).json({
//         status: 400,
//         message: error.message,
//       });
//     }
//     next();
//   };
// };

import createHttpError from 'http-errors';

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      next(createHttpError(400, errorMessage));
    } else {
      next();
    }
  };
};

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: error.message,
      });
    }
    next();
  };
};
