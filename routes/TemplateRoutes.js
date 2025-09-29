import express from 'express';
import { 
    getAlltemplate, 
    addTemplate, 
    updateTemplate, 
    deleteTemplate, 
    searchTemplate 
} from '../controller/templateController.js';

const router = express.Router();

// Remove multer middleware from this route
router.post('/add-template', addTemplate);
router.get('/discover', getAlltemplate);
router.put('/:id', updateTemplate);
router.delete('/:title', deleteTemplate);
router.get('/search', searchTemplate);

export default router;