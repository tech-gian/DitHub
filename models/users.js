var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        default: "",
        select: false
    },
    facebookId: {
        type: String,
        select: false
    },
    admin: {
        type: Boolean,
        default: false,
        select: false
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
