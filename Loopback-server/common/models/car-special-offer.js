'use strict';

module.exports = function(Carspecialoffer) {
    Carspecialoffer.makeSpecialOffer = function(startDate, endDate, carId, price, rentalid, discount, registration, cb) {
        Carspecialoffer.beginTransaction({isolationLevel: Carspecialoffer.Transaction.READ_COMMITED})
        .then((tx) => {
            const postgres = Carspecialoffer.app.dataSources.postgres;
            postgres.connector.execute("SELECT carid FROM carid WHERE carid = '\"" + carId + "\"' FOR UPDATE;",
             null, (err, result) => {
                //mislim da ovo niko ne hvata, sumnjam da ide u ove catchove ispod
                if (err) {
                    throw err;
                }
                Carspecialoffer.app.models.carReservation.find({
                    where: {
                        carsId: '\"' + carId + '\"',
                        startDate: {
                            lte: endDate
                        },
                        endDate: {
                            gte: startDate
                        }
                    }}, {transaction: tx})
                .then((result) => {
                    if (result.length > 0) {
                        throw new Error('Can not make a special offer on this date, conflicting resrevation');
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
                    return Carspecialoffer.app.models.carReservation.create({
                        startDate: startDate, endDate: endDate, 
                        price: price * (1 - discount), myuserId: null, carsId: carId, rentalServiceId: rentalid
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


    Carspecialoffer.removeOffer = function(startDate, registration, cb) {
        var specialOfferId = -1;
        Carspecialoffer.app.models.car.findOne({where: {registration: registration}})
        .then((result) => {
            Carspecialoffer.beginTransaction({isolationLevel: Carspecialoffer.Transaction.READ_COMMITED})
            .then((tx) => {
                const postgres = Carspecialoffer.app.dataSources.postgres;
                postgres.connector.execute("SELECT carid FROM carid WHERE carid = '\"" + result.carsId + "\"' FOR UPDATE;",
                function(err, result) {
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
                        if (typeof result.myuserId !== 'undefined') {
                            throw new Error("This special offer is already reserved");
                        }
                        specialOfferId = result.id;
                        return Carspecialoffer.app.models.carReservation.destroyAll({id: result.carReservationsId}, {transaction: tx});
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
            }
            )
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

};