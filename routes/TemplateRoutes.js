import express from 'express';
const router=express.Router();
import { getAlltemplate,addTemplate, deleteTemplate, updateTemplate } from '../controller/templateController.js';

router.get('/discover',getAlltemplate);
router.post('/add-template',addTemplate);
router.put('/update-template/:id', updateTemplate);
router.delete('/delete-template/:title',deleteTemplate)


export default router;