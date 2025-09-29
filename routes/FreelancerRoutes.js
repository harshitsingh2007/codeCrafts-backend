import express from 'express';
import { CreateFreeLancer, fetchAllFreelancer } from '../controller/FreeLancerController.js';

const router= express.Router();

router.post('/create',CreateFreeLancer);
router.get('/all',fetchAllFreelancer);


export default router;