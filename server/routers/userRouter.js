const express = require('express');
const router = express.Router();
//controllers imports
const { signup, login, getInfo } = require('../controllers/userController.js');

//middleware imports
const validator = require('../middlewares/validator.js');
const auth = require('../middlewares/auth.js');
const { registrationSchema, loginSchema } = require('../validations/userValidations.js');
const uploadFile = require('../middlewares/uploadFile.js');




router.post('/signup', uploadFile, validator(registrationSchema), signup);
router.post('/login', validator(loginSchema), login);
router.get('/:username', auth, getInfo);





module.exports = router;