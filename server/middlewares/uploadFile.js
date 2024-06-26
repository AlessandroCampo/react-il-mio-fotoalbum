
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const storage = require('../utils/storage.js');
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});




const uploadFile = (req, res, next) => {
    upload.single('image')(req, res, async function (err) {
        if (err) {
            return next(err);
        } else if (!req.file) {
            return next(new Error('No file uploaded'));
        }

        try {
            const imageUrl = req.file.path;
            req.body.image = imageUrl;

            next();
        } catch (error) {
            return next(error);
        }
    });
};

module.exports = uploadFile;
