import express from 'express';
import { Signup,Login, logout, forgotPassword, resetpassword} from '../controller/authController.js';

const router = express.Router();

router.post('/signup',Signup);
router.post('/login',Login)
router.post('/logout',logout)
router.post('/forgot-password',forgotPassword)
router.post('/rest-password',resetpassword)



export default router;

