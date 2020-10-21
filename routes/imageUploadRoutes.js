const { Router } = require("express");
const imageUploadController = require("../controllers/imageUploadController");



const router = Router();


router.get('/upload', imageUploadController.imageUpload_get);

// Pulls the image uploaded to the html element 'imageUpload' in the form on upload.ejs
// and saves it to the multer storage space 
router.post('/upload', imageUploadController.upload.single('imageUpload'), imageUploadController.imageUpload_post);

router.post('/uploadMultiple', imageUploadController.upload.array('imageUpload', 10), imageUploadController.imageUpload_postMultiple);

module.exports = router;
 