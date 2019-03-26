const express = require('express');
const bodyParser = require('body-parser');

const rentalRouter = express.Router();

//single dummy car rental object to test outing changing the rental service, will refresh once server restarts
var dummyRental = {
    name: 'Original dummy name',
    address: 'Original dummy address',
    description: 'Original dummy description',
    priceMenu: {
        categoryA: 100,
        categoryB: 100,
        categoryC: 100
    },
    vehicleList: [
        {
            make: 'Volkswagen',
            serial: '1122'
        },
        {
            make: 'BMW',
            serial: '1122'
        }
    ],
    branchList: [
        {
            name: 'Dummy branch 1',
            address: 'Dummy address 1'
        },
        {
            name: 'Dummy branch 2',
            address: 'Dummy address 2'
        }
    ]
}
    

rentalRouter.route('/:serviceName')
.all((req, res, next) =>  {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Get for rental service not implemented yet');
})
.post((req, res, next) => {
    res.end('Post for rental service not implemented yet');
})
.delete((req, res, next) => {
    res.end('Delete for rental service not implemented yet');
})
.put((req, res, next) => {
    //this rest call only changes primitive attributes (name, address, description, priceMenu)
    res.setHeader('Content-Type', 'application/json');
    var rentalServiceList = [dummyRental];
    var matchingService = null
    for (rental of rentalServiceList) {
        if (rental.name == req.body.name) {
            matchingService = rental;
            break;
        }
    }
    if (matchingService == null) {
        res.json(null);
        res.end();
    } else {
        if (req.body.address == "" || req.body.description == "") {
            res.json(null);
            res.end();
            return;
        }
        if (isNaN(req.body.priceMenu.categoryA) || isNaN(req.body.priceMenu.categoryB)
        || isNaN(req.body.priceMenu.categoryC)) {
            res.json(null);
            res.end();
            return;
        }
        matchingService.address = req.body.address;
        matchingService.description = req.body.description;
        matchingService.priceMenu.categoryA = req.body.priceMenu.categoryA;
        matchingService.priceMenu.categoryB = req.body.priceMenu.categoryB;
        matchingService.priceMenu.categoryC = req.body.priceMenu.categoryC;
        res.json(matchingService);
        res.end();
    }    
})

module.exports = rentalRouter;