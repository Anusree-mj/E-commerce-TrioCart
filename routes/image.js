var express = require('express');
var router = express.Router();
var path = require('path');
var productHelpers = require('../helpers/product-helpers')
const multer = require('multer');
const adminHelpers = require('../helpers/admin-helpers');
const productUpdateHelpers = require('../helpers/productUpdate-helpers');

const storage = multer.diskStorage({
    destination: ((req, file, cb) => {
        cb(null, './public/images/products');
    }),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'detailedImages', maxCount: 5 }
]), function (req, res, next) {
    console.log('sdfsd', req.files)
    const image = req.files['image'] ? req.files['image'][0] : null;
    const detailedImages = req.files['detailedImages'] || [];
    const imagePathWithoutPublic = path.relative('public', image?.path);
    const detailedImagesPathsWithoutPublic = detailedImages.map(image => path.relative('public', image.path));
    res.status(200).json({ imagePathWithoutPublic,detailedImagesPathsWithoutPublic, status:'ok' });
})

module.exports = router;