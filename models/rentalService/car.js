const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const carReservation = require('./carReservation.js')

const carSchema = new Schema({
    make: {
        required: true,
        type: String
    },
    registration: {
        required: true,
        type: String,
        unique: true
    },
    serviceName: {
        required: true,
        type: String
    },
    category: {
        required: true,
        type: String
    },
    seats: {
        required: true,
        type: Number
    },
    reservations: [carReservation.schema]

},{
    timestamps: true
});

var Cars = mongoose.model('Car', carSchema);

module.exports = Cars;
