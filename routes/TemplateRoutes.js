import express from 'express';
import { 
    getAlltemplate, 
    addTemplate, 
    getOwnerTemplate
    ,CommnetOnTemplate,
    getCommentsOnTemplate,
    saveTemplate,
    getsavedTemplates,
    deleteSavedTemplate,
    removeOwnerTemplate
} from '../controller/templateController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Remove multer middleware from this route
router.post('/add-template',verifyToken,addTemplate);
router.get('/discover', getAlltemplate);

router.get('/owner-templates',verifyToken,getOwnerTemplate);
router.post('/delete-owner-template',verifyToken,removeOwnerTemplate);
router.post('/comment/:id',verifyToken,CommnetOnTemplate);
router.get('/comment/:id',getCommentsOnTemplate);

router.post('/save-template/:id',verifyToken,saveTemplate);
router.get('/save-template',verifyToken,getsavedTemplates);
router.post('/delete-saved-template',verifyToken,deleteSavedTemplate)

export default router;