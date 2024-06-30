const express = require('express');
const router = express.Router();
router.use(express.static('public'));
//controllers imports
const { index, create, show, destroy, update, hideOrShow, like, getPersonalizedFeed } = require('../controllers/pictureController.js');

//middlewares imports
const handleFileUplaod = require('../middlewares/uploadFile.js');
const auth = require('../middlewares/auth.js');
const isUserPicture = require('../middlewares/isUserPicture.js');
const validator = require('../middlewares/validator.js');
const { pictureCreateSchema } = require('../validations/pictureValidation.js')


router.get('/', index);
router.get('/get-feed', auth, getPersonalizedFeed);
router.post('/', handleFileUplaod, auth, validator(pictureCreateSchema), create);
router.get('/:slug', show);
router.delete('/:slug', auth, isUserPicture, destroy);
router.post('/:slug/like', auth, like)
router.put('/:slug', auth, isUserPicture, update);
router.patch('/:slug/change-visibility', auth, isUserPicture, hideOrShow);

module.exports = router;