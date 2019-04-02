const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const branchSchema = new Schema({
    name: {
        required: true,
        type: String
    },
    address: {
        required: true,
        type: String
    }
},{
    timestamps: true
});

var Branches = mongoose.model('Branch', branchSchema);

module.exports = Branches;
