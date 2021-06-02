const HttpError = require('../util/http-error');
const File = require('../models/file');
const { getGfs } = require('../config/database');

const uploadFile = (req, res, next) => {
    let file = new File({
        filename: req.file.filename,
        fileId: req.file.id,
        fileType: req.file.mimetype.toLowerCase()
    });

    file.save().then(file => {
        res.status(201).json({
            success: true
        });
    }).catch(err => {
        console.log(err);
        return next(new HttpError('Internal Server Error.', 500))
    })
}

const getFiles = async (req, res, next) => {
    let files;
    try {
        files = await File.find({});
    } catch (err) {
        console.log('DB Error: ' + err);
        return next(new HttpError('Internal Server Error.', 500));
    }

    if (!files || files.length === 0)
        return next(new HttpError('No files available', 404));
    res.json({
        files: files.map(file => file.toObject({ getters: true }))
    })
};

const getFileById = async (req, res, next) => {
    const fileId = req.params.fileId;
    if (!fileId)
        return next(new HttpError('Required file id.', 403));
    let file;
    try {
        file = await File.findById(fileId);
    } catch (err) {
        console.log('DB Error: ' + err);
        return next(new HttpError('Internal Server Error.', 500));
    }

    if (!file)
        return next(new HttpError('File not found.', 404));
    try {
        const gfs = getGfs();
        res.set('Content-Type', file.fileType);
        gfs.openDownloadStreamByName(file.filename).pipe(res);
    } catch (err) {
        return next(new HttpError('Internal Server Error.', 500));
    }
};

exports.uploadFile = uploadFile;
exports.getFiles = getFiles;
exports.getFileById = getFileById;