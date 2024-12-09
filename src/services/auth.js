import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
import { randomBytes } from 'crypto';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
// import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';

// РЕЕСТРАЦІЯ

export const registerUser = async ({ name, email, password }) => {
  // Перевірка, чи існує користувач із такою поштою
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  // Хешування пароля
  const hashedPassword = await bcrypt.hash(password, 10);

  // Створення нового користувача
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return newUser;
};

//ЛОГІН

export const loginUser = async ({ email, password }) => {
  // Знайти користувача
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  // Перевірити пароль
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Unauthorized');
  }

  // Видалити стару сесію
  await SessionsCollection.deleteOne({ userId: user._id });

  // Генерація токенів
  const accessToken = randomBytes(30).toString('hex');
  const refreshToken = randomBytes(30).toString('hex');

  // Створити нову сесію
  await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });

  return { accessToken, refreshToken };
};

export const refreshSession = async (oldRefreshToken) => {
  // Знайти сесію за refreshToken
  const session = await SessionsCollection.findOne({
    refreshToken: oldRefreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  // Видалення попередньої сесії
  await SessionsCollection.deleteOne({ refreshToken: oldRefreshToken });

  // Генерація нового accessToken та refreshToken
  const accessToken = randomBytes(30).toString('hex');
  const newRefreshToken = randomBytes(30).toString('hex');

  // Створення нової сесії
  await SessionsCollection.create({
    userId: session.userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES), // 15 хвилин
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS), // 30 днів
  });

  // Повернення нових токенів
  return { accessToken, newRefreshToken };
};

export const logoutUser = async (refreshToken) => {
  // Знайти сесію за refreshToken
  const session = await SessionsCollection.findOne({ refreshToken });

  if (!session) {
    throw createHttpError(404, 'Session not found');
  }

  // Видалити сесію
  await SessionsCollection.deleteOne({ _id: session._id });
};
