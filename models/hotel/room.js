const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
    number: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    beds: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    }
},{
    timestamps: true
});

var Rooms = mongoose.model('Room', roomSchema);

module.exports = Rooms;
