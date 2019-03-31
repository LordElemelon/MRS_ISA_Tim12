const express = require('express');
const bodyParser = require('body-parser');
const Hotels = require('../models/hotel/hotel.js');

const hotelRouter = express.Router();
hotelRouter.use(bodyParser.json());

hotelRouter.route('/')
    .put((req,res) => {
        if (req.body.year > 2019){
            res.send("<html><body>fail, it couldn't have been established after 2019</body><html>");
            return;
        }
        //modifying the hotel
        Hotels.findOneAndUpdate({"name" : "hotel1"}, {
            $set: {"name" : req.body.name, "address" : req.body.address, "description" : req.body.description}
        }, {new : true})
            .then((hotel) => {
                res.send(hotel);
            })
            .catch((err) => {
                res.send({err});
            });
    });

module.exports = hotelRouter;
