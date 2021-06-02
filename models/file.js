const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
    filename: {
        required: true,
        type: String,
    },
    fileId: {
        required: true,
        type: String,
    },
    createdAt: {
        default: Date.now(),
        type: Date,
    },
    fileType: {
        required: true,
        type: String
    }
});

module.exports = mongoose.model('file', FileSchema);