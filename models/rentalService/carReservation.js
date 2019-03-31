const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carReservationSchema = new Schema({
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
        required: true
    },
    user: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

var CarReservations = mongoose.model('CarReservation', carReservationSchema);

module.exports = CarReservations;
