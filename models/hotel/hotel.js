const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Room = require('./room.js');


const hotelSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    rooms : [Room.schema]
},{
    timestamps: true
});

var Hotels = mongoose.model('Hotel', hotelSchema);

module.exports = Hotels;
