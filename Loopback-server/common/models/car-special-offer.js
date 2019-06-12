'use strict';

module.exports = function(Carspecialoffer) {
    var myPrices;
    Carspecialoffer.makeSpecialOffer = function(startDate, endDate, carId, price, rentalid, discount, registration, cb) {
        Carspecialoffer.beginTransaction({isolationLevel: Carspecialoffer.Transaction.READ_COMMITED})
        .then((tx) => {
            const postgres = Carspecialoffer.app.dataSources.postgres;
            postgres.connector.execute("SELECT carid FROM carid WHERE carid = $1 FOR UPDATE;", ['"' + carId + '"'], {transaction: tx}, (err, result) => {
                if (err) {
                    throw err;
                }
                Carspecialoffer.app.models.carReservation.find({
                    where: {
                        carsId:  carId,
                        startDate: {
                            lte: endDate
                        },
                        endDate: {
                            gte: startDate
                        }
                    }}, {transaction: tx})
                .then((result) => {
                    if (result.length > 0) {
                        throw new Error('Can not make a special offer on this date, conflicting reserevation');
                    }
                    return Carspecialoffer.find({where: {
                        carsId: carId,
                        startDate: {
                            lte: endDate
                        },
                        endDate: {
                            gte: startDate
                        }
                    }}, {transaction: tx});                      
                })
                .then((result) => {
                    if (result.length > 0) {
                        throw new Error('Can not make a special offer on this date, conflicting special offer');
                    }
                    return Carspecialoffer.app.models.CarPrice.find({where: {rentalServiceId: rentalid,
                        start: {lte: startDate}}, order: "start DESC"});
                })
                .then((result) => {
                    myPrices = result;
                    if (myPrices.length == 0) throw new Error("No price defined for this vehicle");
                    return Carspecialoffer.app.models.car.findById(carId);
                })
                .then((car) => {

                    if (!Carspecialoffer.matchCarWithPrice(myPrices, car, startDate, endDate, price)) throw new Error("Price sent does not match");
                    if (discount <= 0 || discount >= 100) throw new Error("Invalid discount percentage");
                    var oneDay = 24*60*60*1000;
                    var days = Math.round(Math.abs(startDate.getTime() - endDate.getTime()) / oneDay) + 1;
                    
                    var total_price = Math.round(price * (100 - discount) / 100);
                    console.log(total_price);
                    return Carspecialoffer.app.models.carReservation.create({
                        startDate: startDate, endDate: endDate, isSpecialOffer: true,
                        price: total_price, myuserId: null, carsId: carId, rentalServiceId: rentalid
                    }, {transaction: tx});
                })
                .then((result) => {
                    return Carspecialoffer.create({startDate: startDate, endDate: endDate, carsId: carId, basePrice: price,
                         rentalServiceId: rentalid, carReservationsId: result.id,discount: discount, myuserId: null,
                         registration: registration}, {transaction: tx});
                    
                })
                .then((result) => {
                    tx.commit();
                    cb(null, result);
                })
                .catch((err) => {
                    tx.rollback();
                    cb(err, null);
                })
            });
        })
        .catch((err) => {
            cb(err, null);
        });
    };

    Carspecialoffer.matchCarWithPrice = function(prices, car, startDate, endDate, price) {
		var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
        var days = 1 + Math.round(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)));
        console.log("Pokusana: " + price);
		console.log("Sracunata: " + (prices[0]['cat' + car.category + 'Price']) * days);
		return prices[0]['cat' + car.category + 'Price'] * days == price;
	}

    Carspecialoffer.remoteMethod('makeSpecialOffer',{
        accepts: [{arg: 'startDate', type: 'date', required: true}, 
				  {arg: 'endDate', type: 'date', required: true},
				  {arg:'carId', type: 'string', required: true},
				  {arg: 'price', type: 'number', required: true},
                  {arg: 'rentalid', type: 'string', required: true},
                  {arg: 'discount', type: 'number', required: true},
                  {arg: 'registration', type: 'string', required: true}],
        http: {path: '/makeSpecialOffer', verb: 'post' },
        returns: {type: 'object', arg: 'retval'}
    });


    Carspecialoffer.quicklyReserve = function(carId, specialOfferId, userId, cb) {
        var mySpecialOffer;
        Carspecialoffer.beginTransaction({isolationLevel: Carspecialoffer.Transaction.READ_COMMITED})
        .then((tx) => {
            const postgres = Carspecialoffer.app.dataSources.postgres;
            postgres.connector.execute("SELECT carid FROM carid WHERE carid = $1 FOR UPDATE;", ['"' + carId + '"'], {transaction: tx}, (err, result) => {
                if (err) throw err;
                Carspecialoffer.findById(specialOfferId)
                .then((result) => {
                    if (result == null) throw new Error('Could not find special offer with this id');
                    if (result.myuserId != null) throw new Error('This special offer is already reserved');
                    mySpecialOffer = result;
                    return Carspecialoffer.app.models.carReservation.updateAll({id: mySpecialOffer.carReservationsId}, {myuserId: userId}, {transaction: tx})
                })
                .then((result) => {
                    if (result.count != 1) throw new Error("Transaction failed");
                    return Carspecialoffer.updateAll({id: mySpecialOffer.id}, {myuserId: userId}, {transaction: tx})
                })
                .then((result) => {
                    if (result.count != 1) throw new Error("Transaction failed");
                    tx.commit();
                    cb(null, result);
                })
                .catch((err) => {
                    tx.rollback();
                    cb(err, null);
                });
            });
        })
        .catch((err) => {
            cb(err, null);
        })
    }

    Carspecialoffer.remoteMethod('quicklyReserve', {
        accepts: [{arg: 'carId', type: 'string', required: true},
                  {arg: 'specialOfferId', type: 'string', required: true},
                  {arg: 'userId', type: 'string', required: true}],
        http: {path: '/quicklyReserve', verb: 'post'},
        returns: {type: 'object', arg: 'retval'}
    });

    Carspecialoffer.removeOffer = function(startDate, registration, cb) {
        var specialOfferId = -1;
        Carspecialoffer.app.models.car.findOne({where: {registration: registration}})
        .then((result) => {
            if (result == null) throw new Error("No car found");
            Carspecialoffer.beginTransaction({isolationLevel: Carspecialoffer.Transaction.READ_COMMITED})
            .then((tx) => {
                const postgres = Carspecialoffer.app.dataSources.postgres;
                postgres.connector.execute("SELECT carid FROM carid WHERE carid = $1 FOR UPDATE;", ['"' + carId + '"'], {transaction: tx}, (err, result) => {
                    //mislim da ovo niko ne hvata, sumnjam da ide u ove catchove ispod
                    if (err) {
                        throw err;
                    }
                    Carspecialoffer.find({where: {
                        registration: registration,
                        startDate: {
                            lte: startDate
                        },
                        endDate: {
                            gte: startDate
                        }
                    }})
                    .then((result) => {
                        if (result[0].myuserId != null) {
                            throw new Error("This special offer is already reserved");
                        }
                        specialOfferId = result[0].id;
                        return Carspecialoffer.app.models.carReservation.destroyAll({id: result[0].carReservationsId}, {transaction: tx});
                    })
                    .then((result) => {
                        return Carspecialoffer.destroyAll({id: specialOfferId}, {transaction: tx});
                    })
                    .then((result) => {
                        tx.commit();
                        cb(null, result);
                    })
                    .catch((err) => {
                        tx.rollback();
                        cb(err, null);
                    })
                });
            })
            .catch((err) => {
                cb(err, null);
            });
        })
        .catch((err) => {
            cb(err, null);
        })
    };

    Carspecialoffer.remoteMethod('removeOffer', {
        accepts: [{arg: 'startDate', type: 'date', required: true},
                  {arg: 'registration', type: 'string', required: true}],
        http: {path: '/removeSpecialOffer', verb: 'delete'},
        returns: {type: 'object', arg: 'retval'}
    });

    Carspecialoffer.changeOffer = function(startDate, registration, newDiscount, cb) {
        var specialOfferId = -1;
        Carspecialoffer.app.models.car.findOne({where: {registration: registration}})
        .then((result) => {
            if (result == null) throw new Error("No car found");
            Carspecialoffer.beginTransaction({isolationLevel: Carspecialoffer.Transaction.READ_COMMITED})
            .then((tx) => {
                const postgres = Carspecialoffer.app.dataSources.postgres;
                postgres.connector.execute("SELECT carid FROM carid WHERE carid = $1 FOR UPDATE;", ['"' + carId + '"'], {transaction: tx}, (err, result) => {
                    //mislim da ovo niko ne hvata, sumnjam da ide u ove catchove ispod
                    if (err) {
                        throw err;
                    }
                    Carspecialoffer.find({where: {
                        registration: registration,
                        startDate: {
                            lte: startDate
                        },
                        endDate: {
                            gte: startDate
                        }
                    }})
                    .then((result) => {
                        if (result[0].myuserId != null) {
                            throw new Error("This special offer is already reserved");
                        }
                        var newPrice = Math.round(result[0].basePrice * (1 - newDiscount / 100));
                        specialOfferId = result[0].id;
                        return Carspecialoffer.app.models.carReservation.updateAll({id: result.carReservationsId}, {price: newPrice},{transaction: tx});
                    })
                    .then((result) => {
                        return Carspecialoffer.updateAll({id: specialOfferId}, {discount: newDiscount}, {transaction: tx});
                    })
                    .then((result) => {
                        tx.commit();
                        cb(null, result);
                    })
                    .catch((err) => {
                        tx.rollback();
                        cb(err, null);
                    })
                });
            })
            .catch((err) => {
                cb(err, null);
            });
        })
        .catch((err) => {
            cb(err, null);
        })
    }

    Carspecialoffer.remoteMethod('changeOffer', {
        accepts: [{arg: 'startDate', type: 'date', required: true},
                  {arg: 'registration', type: 'string', required: true},
                  {arg: 'newDiscount', type: 'number', required: true}],
        http: {path: '/changeSpecialOffer', verb: 'put'},
        returns: {type: 'object', arg: 'retval'}
    });

};
