import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema } from '../validation/authValidation.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerController } from '../controllers/auth.js';
import { loginSchema } from '../validation/authValidation.js';
import { loginController } from '../controllers/auth.js';
import { refreshSessionController } from '../controllers/auth.js';
import { logoutController } from '../controllers/auth.js';

const router = express.Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));

router.post('/refresh', ctrlWrapper(refreshSessionController));

router.post('/logout', ctrlWrapper(logoutController));
export default router;
