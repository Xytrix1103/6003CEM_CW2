// test routes file using test controller
import { Router } from 'express';
import { registerController } from '../controllers/authController';

const router = Router();

// Define a test route that uses the testController
router.post('/register', registerController);

export default router;