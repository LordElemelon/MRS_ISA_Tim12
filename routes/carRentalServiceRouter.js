const express = require('express');
const bodyParser = require('body-parser');
const RentalServices = require('../models/rentalService/rentalService.js');


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
    branchList: [
        {
            name: 'Dummy branch 1',
            address: 'Dummy address 1',
            vehicleList: [
                {
                    make: 'Volkswagen',
                    serial: '1',
                    category: 'B',
                    seats: 4,
                    taken: [
                        {
                            start: new Date('December 17, 2018 03:24:00'),
                            end: new Date('December 20, 2018 03:24:00')
                        },
                        {
                            start: new Date('January 2, 2019 03:24:00'),
                            end: new Date('January 10, 2019 03:24:00')
                        }
                    ]
                },
                {
                    make: 'BMW',
                    serial: '2',
                    category: 'A',
                    seats: 5,
                    taken: [

                    ]
                }
            ]
        },
        {
            name: 'Dummy branch 2',
            address: 'Dummy address 2',
            vehicleList: [
                {
                    make: 'Volkswagen',
                    serial: '3',
                    category: 'B',
                    seats: 3,
                    taken: [

                    ]
                },
                {
                    make: 'BMW',
                    serial: '4',
                    category: 'C',
                    seats: 5,
                    taken: [

                    ]
                }
            ]
        }
    ]
}
    

rentalRouter.route('/modifyRentalService')
.all((req, res, next) =>  {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    RentalServices.find({
        name: 'Original dummy name'
    }).then((result) => {
        res.json(result);
        res.end();
    }).catch((err) => {
        console.log(err);
    })
})
.post((req, res, next) => {
    RentalServices.create(
        {
            name: 'Original dummy name',
            address: 'Original dummy address',
            description: 'Original dummy description',
            cars: [
                {
                    make: 'Volkswagen',
                    registration: '1',
                    category: 'A',
                    seats: 4,
                    reservations: [
                        {
                            from: new Date('December 17, 2018 03:24:00'),
                            to: new Date('December 20, 2018 03:24:00'),
                            user: 'DummyUsername'
                        }
                    ]
                }

            ],
            branches: [
                {
                    name: 'Dummy branch 1',
                    address: 'Dummy address 1'
                },
                {
                    name: 'Dummy branch 2',
                    address: 'Dummy address 2'
                }
            ]
        }).then((result) => {
            console.log('Uspeo')
        }).catch((err) => {
            console.log('Times is hard')
        });
    
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
});

rentalRouter.route('/searchVehicles')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-type', 'text/html');
    next();
})
.get((req, res, next) => {
    /*
        Expected query json
        {
            start: startDate,
            end: endDate,
            seats: number of seats, or undefined,
            category: category, or undefined,
            place: branch name, or undefined,
        }
    */
    req.body.start = new Date(req.body.start);
    req.body.end = new Date(req.body.end);
    vehicleFilterMethods = []
    vehicleFilterMethods.push((vehicle) => {
        for (interval of vehicle.taken) {
            if ((req.body.start <= interval.end) && (req.body.end >= interval.start)) {
                return false;
            }
        }
        return true;
    });
    if (typeof req.body.seats != 'undefined' ) {
        if (!isNaN(req.body.seats)) {
            vehicleFilterMethods.push((vehicle) => {
                return vehicle.seats = req.body.seats;
            })
        }
    }
    if (typeof req.body.category != 'undefined') {
        vehicleFilterMethods.push((vehicle) => {
            return req.body.category == vehicle.category;
        })
    }
    vehicleList = [];
    for (branch of dummyRental.branchList) {
        if (typeof req.body.place  != 'undefined') {
            if (req.body.place != branch.name) {
                continue;
            }
        }
        for (vehicle of branch.vehicleList) {
            vehicleList.push(vehicle);
        }
    }
    retVal = [];
    for (vehicle of vehicleList) {
        var passed = true;
        for (method of vehicleFilterMethods) {
            if (!method(vehicle)) {
                passed = false;
                break;
            }
        }
        if (passed) {
            retVal.push(vehicle);
        }
    }
    res.setHeader('Content-type', 'application/json');
    res.json(retVal);
    res.end();
})
.post((req, res, next) => {
    res.end('Post for vehicle search not implemented yet');
})
.put((req, res, next) => {
    res.end('Put for vehicle search not implemented yet');
})
.delete((req, res, next) => {
    res.end('Delete for vehicle search not implemented yet');
});

module.exports = rentalRouter;