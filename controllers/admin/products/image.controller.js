const path = require('path');
const uploadImage =(req, res) => {
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
}
module.exports = uploadImage
