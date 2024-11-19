// src/server.js

import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const logger = pino();
const loggerMiddleware = pinoHttp({ logger });

function setupServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(loggerMiddleware);
  app.use(express.json());

  // Роутинг
  app.use('/contacts', contactsRouter);

  // Middleware для обробки неіснуючих маршрутів
  app.use(notFoundHandler);

  // Middleware для обробки помилок
  app.use(errorHandler);

  // Запуск сервера
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
}

export default setupServer;
