const express = require('express');
const router = express.Router();
router.use(express.static('public'));
//controllers imports
const { index, create, show, destroy, update, hideOrShow, like, getPersonalizedFeed, removeLike, storeDownload, storeView } = require('../controllers/pictureController.js');

//middlewares imports
const handleFileUplaod = require('../middlewares/uploadFile.js');
const auth = require('../middlewares/auth.js');
const isUserPicture = require('../middlewares/isUserPicture.js');
const validator = require('../middlewares/validator.js');
const { pictureCreateSchema, pictureUpdateSchema } = require('../validations/pictureValidation.js')


router.get('/', index);
router.get('/get-feed', auth, getPersonalizedFeed);
router.post('/', handleFileUplaod, auth, validator(pictureCreateSchema), create);
router.get('/:slug', show);
router.delete('/:slug', auth, isUserPicture, destroy);
router.post('/:slug/like', auth, like);
router.post('/:slug/download', auth, storeDownload);
router.post('/:slug/view', auth, storeView);
router.post('/:slug/save', auth, storeView);
router.delete('/:slug/like', auth, removeLike);
router.put('/:slug', auth, isUserPicture, validator(pictureUpdateSchema), update);
router.patch('/:slug/change-visibility', auth, isUserPicture, hideOrShow);

module.exports = router;