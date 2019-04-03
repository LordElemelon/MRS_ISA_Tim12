const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const car = require('./car.js')
const branch = require('./branch.js')

const rentalServiceSchema = new Schema({
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
        type: String,
        required: true,
    },
    branches: [branch.schema]

},{
    timestamps: true
});

var rentalServices = mongoose.model('RentalService', rentalServiceSchema);

module.exports = rentalServices;
