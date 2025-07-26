import express from 'express';
import { Signup } from '../controller/authController.js';

const router = express.Router();

router.post('/signup',Signup);



export default router;