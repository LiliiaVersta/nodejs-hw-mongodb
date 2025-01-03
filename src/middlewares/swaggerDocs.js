// src/middlewares/swaggerDocs.js

import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';
import createHttpError from 'http-errors';

const SWAGGER_PATH = path.resolve('docs/swagger.json');

export const swaggerDocs = (req, res, next) => {
  try {
    const swaggerDoc = JSON.parse(fs.readFileSync(SWAGGER_PATH, 'utf8'));

    return swaggerUI.setup(swaggerDoc)(req, res, next);
  } catch (err) {
    console.error('Error loading Swagger docs:', err);
    next(createHttpError(500, "Can't load Swagger docs"));
  }
};
