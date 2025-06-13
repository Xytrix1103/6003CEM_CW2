// test routes file using test controller
import {Router} from 'express';
import {testController} from '../controllers/test';
import authenticate from "../middlewares/auth";

const router = Router();

router.use(authenticate);

// Define a test route that uses the testController
router.get('/', testController);

export default router;