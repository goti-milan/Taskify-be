import { Router } from 'express';
import { fetchUser, login, userRegister, refreshToken } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { handleValidationErrors } from '../middleware/validation.middleware';
import { validateUserRegistration, validateUserLogin } from '../validations/user.validation';

const router = Router();

router.post('/register', validateUserRegistration, handleValidationErrors, userRegister);
router.post('/login', validateUserLogin, handleValidationErrors, login);
router.post('/refresh', refreshToken);
router.get('/', authenticateToken, fetchUser);

export default router;
