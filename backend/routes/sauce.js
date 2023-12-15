const express = require('express');
const router = express.Router();    
const sauce = require('../models/sauces');


const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const stuffCtrl = require('../controllers/sauce');

router.post('/', auth, multer, stuffCtrl.createSauce );
router.get('/',  auth, stuffCtrl.getAllSauce);
router.get('/:id', auth, stuffCtrl.getOneSauce);
router.put('/:id', auth, multer, stuffCtrl.modifySauce);
router.delete('/:id', auth, stuffCtrl.deleteSauce); 
  
module.exports = router;
  