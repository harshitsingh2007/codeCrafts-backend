import express from 'express';
import { Signup,Login, logout } from '../controller/authController.js';

const router = express.Router();

router.post('/signup',Signup);
router.post('/login',Login)
router.post('/logout',logout)


export default router;

