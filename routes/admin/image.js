const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const controller = require("../../controllers")

const storage = multer.diskStorage({
    destination: ((req, file, cb) => {
        cb(null, './public/images/products');
    }),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, 
    },
});

router.post('/', upload.single('image'), controller.adminControllers.imageController)

module.exports = router;