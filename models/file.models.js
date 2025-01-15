// models/file.js
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: [true , 'path is required']
    },
    public_id: {
        type: String,
        required: true
    },
    originalname:{
        type: String,
        required: [true, 'original name is required']
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // reference to User model
        required: [true, 'user is required']
    },
    imgUrl: {
        type: String,
        required: true
    }

});

const File = mongoose.model("File", fileSchema);
module.exports = File;
