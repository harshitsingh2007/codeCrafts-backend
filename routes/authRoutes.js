import express from 'express';
import { Signup,Login, logout, forgotPassword, resetPassword, checkAuth, verifyEmail} from '../controller/authController.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();
router.get("/check-auth",verifyToken,checkAuth)
router.post('/signup',Signup);
router.post('/login',Login)
router.post('/logout',logout)
router.post('/verify-email',verifyEmail,)
router.post('/forgot-password',forgotPassword)
router.post('/reset-password',resetPassword)



export default router;

