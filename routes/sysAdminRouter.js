const express = require('express');
const bodyParser = require('body-parser');

const sysAdminRouter = express.Router();
sysAdminRouter.use(bodyParser.json());
var hotel = {"name" : "Hotel1", "address" : "Address1", "description" : "Description1",
             "year" : 1911};

sysAdminRouter.route('/')
    .all((req,res,next) => {
        res.statusCode = 200;
        next();
    })
    .put((req,res) => {
        if (req.body.year > 2019){
            res.send("<html><body>fail, it couldn't have been established after 2019</body><html>");
            return;
        }
        hotel.address = req.body.address;
        hotel.description = req.body.description;
        res.send(hotel);
    });
module.exports = sysAdminRouter;
