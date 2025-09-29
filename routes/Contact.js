import express from 'express';
import  {createcontact, getAllContacts} from '../controller/ContactController.js'
const router = express.Router();

router.post('/createcontact/:id',createcontact);
router.get('/getAllContacts/:id',getAllContacts);

export default router;
