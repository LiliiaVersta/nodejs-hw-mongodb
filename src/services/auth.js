import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';

import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import { sendEmail } from '../utils/sendMail.js';
import { TEMPLATES_DIR } from '../constants/index.js';

// **Реєстрація нового користувача**
export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return newUser;
};

// **Логін користувача**
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteMany({ userId: user._id });

  const accessToken = `access-token-${Date.now()}`;
  const refreshToken = `refresh-token-${Date.now()}`;

  const session = await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });

  return {
    accessToken,
    refreshToken,
    sessionId: session._id,
  };
};

// **Оновлення сесії**
export const refreshSession = async (oldRefreshToken) => {
  const session = await SessionsCollection.findOne({
    refreshToken: oldRefreshToken,
  });
  if (!session) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  const isExpired = new Date() > new Date(session.refreshTokenValidUntil);
  if (isExpired) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await SessionsCollection.deleteOne({ refreshToken: oldRefreshToken });

  const newAccessToken = `access-token-${Date.now()}`;
  const newRefreshToken = `refresh-token-${Date.now()}`;

  const newSession = await SessionsCollection.create({
    userId: session.userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionId: newSession._id,
  };
};

export const logoutUser = async (refreshToken) => {
  const session = await SessionsCollection.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(404, 'Session not found');
  }

  await SessionsCollection.deleteOne({ _id: session._id });
};

export const requestResetToken = async (email) => {
  // Найти пользователя по email
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  // Создать JWT токен на 15 минут
  const resetToken = jwt.sign(
    { sub: user._id, email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' },
  );

  // Считать и скомпилировать шаблон письма
  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();
  const template = handlebars.compile(templateSource);

  // Генерация HTML письма
  const html = template({
    name: user.name,
    link: `${process.env.APP_DOMAIN}/reset-password?token=${resetToken}`,
  });

  // Отправка письма
  const emailSent = await sendEmail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Reset your password',
    html,
  });

  if (!emailSent) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    // Декодировать токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Найти пользователя по email
    const user = await User.findOne({ _id: decoded.sub });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }

    // Хешировать новый пароль
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Обновить пароль пользователя
    user.password = hashedPassword;
    await user.save();

    // Удалить все сессии пользователя
    await SessionsCollection.deleteMany({ userId: user._id });
  } catch (error) {
    console.error('Error resetting password:', error.message);
    throw createHttpError(401, 'Token is expired or invalid.');
  }
};
