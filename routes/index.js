const express = require('express');

const upload = require('../util/gridfs');
const uploadController = require('../controllers/upload-controller');

const router = express.Router();

/*
* Upload file
*/
router.post('/upload', upload.single('file'), uploadController.uploadFile);

/*
* Get all files
*/
router.get('/', uploadController.getFiles);

/*
* Get file by file id
*/
router.get('/file/:fileId', uploadController.getFileById);

module.exports = router;