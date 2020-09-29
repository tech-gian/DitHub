const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const instructionSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    file: {
        type: String
    },
    link: {
        type: String
    }
}, {
    timestamps: true
});

var Instructions = mongoose.model('Instruction', instructionSchema);

module.exports = Instructions;
