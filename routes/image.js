var express = require('express');
var router = express.Router();
var path = require('path');
const multer = require('multer');

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

router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {          
            throw new Error('No file uploaded');
        }       
        const imagePathWithoutPublic = path.relative('public', req.file.path);

        res.status(200).json({ imagePathWithoutPublic, status: 'ok' });
    } catch (error) {        
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

module.exports = router;