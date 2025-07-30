import express from 'express';
import { Signup,Login, logout, verifyEmail, forgotPassword } from '../controller/authController.js';

const router = express.Router();

router.post('/signup',Signup);
router.post('/login',Login)
router.post('/logout',logout)
router.post('/verify-email',verifyEmail)
router.post('/forgot-password',forgotPassword)


export default router;

