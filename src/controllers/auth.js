import { registerUser } from '../services/auth.js';
import { loginUser } from '../services/auth.js';
import { refreshSession } from '../services/auth.js';
import { logoutUser } from '../services/auth.js';
import { THIRTY_DAYS } from '../constants/index.js';

export const registerController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser({ name, email, password });

    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// **Логін**
export const loginController = async (req, res, next) => {
  try {
    const session = await loginUser(req.body);

    if (!session || !session.sessionId) {
      return res.status(500).json({
        status: 500,
        message: 'Failed to create session',
      });
    }

    // Записуємо refreshToken та sessionId у cookies
    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + THIRTY_DAYS),
    });
    res.cookie('sessionId', session.sessionId, {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + THIRTY_DAYS),
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully logged in a user!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// **Оновлення сесії**
export const refreshSessionController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        status: 401,
        message: 'Refresh token is required',
      });
    }

    const session = await refreshSession(refreshToken);

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + THIRTY_DAYS),
    });
    res.cookie('sessionId', session.sessionId, {
      httpOnly: true,
      secure: false,
      expires: new Date(Date.now() + THIRTY_DAYS),
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutController = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        status: 401,
        message: 'Refresh token is required',
      });
    }

    await logoutUser(refreshToken);

    res.clearCookie('refreshToken', { httpOnly: true, secure: false });
    res.clearCookie('sessionId', { httpOnly: true, secure: false });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
