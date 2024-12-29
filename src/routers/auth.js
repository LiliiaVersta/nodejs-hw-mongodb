import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerSchema,
  authValidation,
  loginSchema,
} from '../validation/authValidation.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerController,
  loginController,
  refreshSessionController,
  logoutController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));

router.post('/refresh', ctrlWrapper(refreshSessionController));

router.post('/logout', ctrlWrapper(logoutController));

router.post(
  '/send-reset-email',
  validateBody(authValidation.resetEmail),
  ctrlWrapper(requestResetEmailController),
);
router.post(
  '/auth/reset-pwd',
  validateBody(authValidation.resetPassword),
  ctrlWrapper(resetPasswordController),
);
export default router;
