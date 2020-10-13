const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const announcementSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    source: {
        type: String
    }
},{
    timestamps: true
});

var Announcements = mongoose.model('Announcement', announcementSchema);

module.exports = Announcements;
