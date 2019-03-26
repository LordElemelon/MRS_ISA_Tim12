const express = require('express');
const bodyParser = require('body-parser');

const hotelRouter = express.Router();
hotelRouter.use(bodyParser.json());

var hotels = [];

hotelRouter.route('/')
    .all((req,res,next) => {
        res.statusCode = 200;
        next();
    })
    .post((req,res) => {
        for (hotel of hotels){
            if (hotel.name === req.body.name){
                res.send("<html><body>fail, name already taken</body></html>");
                return;
            }
        }
        if (req.body.year > 2019){
            res.send("<html><body>fail, it couldn't have been established after 2019</body><html>");
            return;
        }
        hotels.push(req.body);
        res.send(hotels);

    });

module.exports = hotelRouter;
