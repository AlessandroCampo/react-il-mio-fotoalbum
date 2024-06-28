const express = require('express');
const router = express.Router();

const { sendMessage, getAuthUserMessage } = require('../controllers/messageController.js');
const auth = require('../middlewares/auth.js');

// const schemas = require('../validations/messageValidation.js');
const validator = require('../middlewares/validator.js');



router.post("/", auth, sendMessage);
router.get("/", auth, getAuthUserMessage);
// router.get("/:interId");
// router.put("/:messageId",);
// router.delete("/:messageId",);





module.exports = router;