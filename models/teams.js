var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

var messageSchema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    comments: [commentSchema]
});

var teamSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    messages: [messageSchema],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

var Teams = mongoose.model('Team', teamSchema);

module.exports = Teams;
