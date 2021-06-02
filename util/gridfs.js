const path = require('path');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const config = require('../config/config');
const multer = require('multer');

const storage = multer({
    storage: new GridFsStorage({
        url: config.mongoURI,
        file: (req, file) => {
            return new Promise((resolve, reject) => {
                crypto.randomBytes(16, (err, buf) => {
                    if (err) {
                        return reject(err);
                    }
                    const filename = buf.toString('hex') + path.extname(file.originalname);
                    const fileInfo = {
                        filename: filename,
                        bucketName: 'files'
                    };
                    console.log(fileInfo);
                    resolve(fileInfo);
                });
            });
        }
    })
});

module.exports = storage;