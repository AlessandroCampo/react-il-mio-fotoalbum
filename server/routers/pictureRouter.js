const express = require('express');
const router = express.Router();
router.use(express.static('public'));
//controllers imports
const { index, create, show, destroy, update, hideOrShow } = require('../controllers/pictureController.js');

//middlewares imports
const handleFileUplaod = require('../middlewares/uploadFile.js');
const auth = require('../middlewares/auth.js');
const isUserPicture = require('../middlewares/isUserPicture.js');
const validator = require('../middlewares/validator.js');
const { pictureCreateSchema } = require('../validations/pictureValidation.js')


router.get('/', auth, index);
router.post('/', handleFileUplaod, auth, validator(pictureCreateSchema), create);
router.get('/:slug', auth, show);
router.delete('/:slug', auth, isUserPicture, destroy);
router.patch(':/slug/change-visibility', isUserPicture, auth, hideOrShow);
router.patch(':/slug', isUserPicture, auth, update);

module.exports = router;