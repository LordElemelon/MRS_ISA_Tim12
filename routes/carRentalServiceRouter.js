const express = require('express');
const bodyParser = require('body-parser');
const Joi = require('joi')
const RentalServices = require('../models/rentalService/rentalService.js');
const RentalServiceJoi = require('./carRentalServiceRouterJoi');

const Cars = require('../models/rentalService/car.js');

const rentalRouter = express.Router();

rentalRouter.route('/modifyRentalService')
.all((req, res, next) =>  {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    next();
})
.get((req, res, next) => {
    //expected json body -> {name: 'name of rental service to get'}
    const result = Joi.validate(req.body, RentalServiceJoi.rentalServiceGetSchema);
    if (result.error != null) {
        //bad request
        res.statusCode = 400;
        res.end();
    } else {
        RentalServices.findOne({
            name: req.body.name
        }).then((result) => {
            res.json(result);
            res.end();
        }).catch((err) => {
            res.json(false);
            res.end();
        });
    }
})
.post((req, res, next) => {
    //expected json body -> {rentalService-> rentalService to add to database}
    //here there is no need for Joi validation because mongoose will handle it
    RentalServices.create(req.body)
    .then((result) => {
        res.json(true);
        res.end();
    })
    .catch((err) => {
        res.json(false);
        res.end();
    });  
})
.delete((req, res, next) => {
    //expected json body -> {name-> name of service to delete}
    const result = Joi.validate(req.body, RentalServiceJoi.rentalServiceDeleteSchema);
    if (result.error != null) {
        //bad request
        res.statusCode = 400;
        res.end();
    } else {
        RentalServices.deleteOne({
            name: req.body.name
        })
        .then((result) => {
            res.json(true);
            res.end();
        })
        .catch((err) => {
            res.json(false);
            res.end();
        });
    }
})
.put((req, res, next) => {
    //this rest call only changes primitive attributes (address, description)
    //expected json body -> {address: 'new address', description: 'new description'}
    const result = Joi.validate(req.body, RentalServiceJoi.rentalServicePutSchema);
    if (result.error != null) {
        //bad request
        res.statusCode = 400;
        res.end();
    } else {
        RentalServices.findOneAndUpdate({name: req.body.name},{address: req.body.address, description: req.body.description}, {new : true})
        .then((result) => {
            res.json(result);
            res.end();
        })
        .catch((err) => {
            res.json(false);
            res.end();
        });
    }
});

rentalRouter.route('/modifyCar')
.all((req, res, next) =>  {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    next();
})
.get((req, res, next) => {
    //expected json body -> {name: 'name of rental service to get'}
    const result = Joi.validate(req.body, RentalServiceJoi.carGetSchema);
    if (result.error != null) {
        //bad request
        res.statusCode = 400;
        res.end();
    } else {
        Cars.findOne({
            registration: req.body.registration
        }).then((result) => {
            res.json(result);
            res.end();
        }).catch((err) => {
            res.json(false);
            res.end();
        });
    }
})
.post((req, res, next) => {
    const result = Joi.validate(req.body, RentalServiceJoi.carPostSchema);
    if (null != null) {
        //bad request
        res.statusCode = 400;
        res.end();
    } else {
        RentalServices.findOne({name: req.body.serviceName})
        .then((result) => {
            if (result == null) {
                throw Error('Vehicle has to exist');
            }
            return Cars.create(req.body)
        })
        .then((result) => {
            res.json(result);
            res.end();
        })
        .catch((err) => {
            res.json(false);
            res.end();
        })
    }
})
.put((req, res, next) => {
    res.setHeader('Content-type', 'text/html');
    res.end("Currently no attributes of a car can be changed.");
})
.delete((req, res, next) => {
    const result = Joi.validate(req.body, RentalServiceJoi.carDeleteSchema);
    if (result.error != null) {
        //bad request
        res.statusCode = 400;
        res.end();
    } else {
        Cars.findOne({registration: req.body.registration})
        .then((result) => {
            if (result == null) {
                throw Error('Vehicle not found');
            } 
            if (result.reservations.length != 0) {
                throw Error('Vehicle has reservations');
            }
            return Cars.deleteOne({registration: req.body.registration})
        })
        .then((result) => {
            res.json(true);
            res.end();
        })
        .catch((err) => {
            res.json(false);
            res.end();
        });
    }
})

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
            start: Number, ticks
            end: Number, ticks
            serviceName: service name,
            seats: number of seats, or undefined,
            category: category, or undefined,
        }
    */
    const result = Joi.validate(req.body, RentalServiceJoi.carSearchSchema);
    if (result.error != null) {
        //bad request
        res.statusCode = 400;
        res.end();
    } else {
        req.body.start = new Date(req.body.start);
        req.body.end = new Date(req.body.end);
        vehicleFilterMethods = []
        vehicleFilterMethods.push((vehicle) => {
            for (interval of vehicle.reservations) {
                if ((req.body.start <= interval.to) && (req.body.end >= interval.from)) {
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
        Cars.find({serviceName: req.body.serviceName})
        .then((result) => {
            retVal = [];
            for (vehicle of result) {
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
        .catch((err) => {
            console.log(err);
            res.json(null);
            res.end();
        });
    }
    
})
.post((req, res, next) => {
    res.end('Post for vehicle search not implemented');
})
.put((req, res, next) => {
    res.end('Put for vehicle search not implemented');
})
.delete((req, res, next) => {
    res.end('Delete for vehicle search not implemented');
});

module.exports = rentalRouter;