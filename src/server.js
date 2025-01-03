// src/server.js

import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
// import swaggerRouter from './routers/swagger.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const logger = pino();
const loggerMiddleware = pinoHttp({ logger });

function setupServer() {
  const app = express();

  app.use(cookieParser());

  app.use(cors());

  app.use(loggerMiddleware);

  app.use(express.json());

  app.use('/contacts', contactsRouter);

  app.use('/auth', authRouter);

  app.use('/', swaggerDocs);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
}

export default setupServer;
