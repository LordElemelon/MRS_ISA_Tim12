const express = require('express');
const bodyParser = require('body-parser');
const Hotels = require('../models/hotel/hotel.js');

const sysAdminRouter = express.Router();
sysAdminRouter.use(bodyParser.json());

var hotels = [];

sysAdminRouter.route('/hotels')
    .post((req,res) => {
        Hotels.create(req.body)
            .then((hotel)=>{
                return Hotels.find({});
            })
            .then((hotels)=>{
                res.send(hotels);
                console.log("brousky");
            })
            .catch((err)=>{
                console.log(err);
                console.log("brou");
                res.send(err);
            });
    });

module.exports = sysAdminRouter;
