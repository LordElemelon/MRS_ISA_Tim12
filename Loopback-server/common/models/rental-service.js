'use strict';

module.exports = function(Rentalservice) {
    Rentalservice.getAvailableServices = function (start,  end, name, address, cb) {
        var searchObject = {};
        if (name) {
            searchObject.name = name;
        }
        if (address) {
            searchObject.address = address;
        }
        Rentalservice.find({where: searchObject})
        .then((result) => {
            Rentalservice.getApp((err, app) => {
                var promises = []
                for (var service of result) {
                    promises.push(
                        new Promise(function(resolve, reject) {
                            var myservice = service;
                            app.models.Car.find({'where': {rentalServiceId: myservice.id}})
                            .then((car_result) =>{
                                var car_id_list = [];
                                for (var car of car_result) {
                                    car_id_list.push('\"' + car.id + '\"');
                                }
                                app.models.carReservation.find({
                                    'where': {
                                        carsId: car_id_list,
                                        startDate: {
                                            lte: end
                                        },
                                        endDate: {
                                            gte: start
                                        }
                                    },
                                    'fields' : {
                                        carsId: true
                                    }
                                })
                                .then((reservation_result) => {
                                    console.log("Pronadjenih kola" + reservation_result.length);
                                    console.log("Ukupno kola" + car_id_list);
                                    if (reservation_result.length < car_id_list.length) {
                                        resolve(myservice);
                                    } else {
                                        resolve(null);
                                    }
                                })
                                .catch((err) => {
                                    reject();
                                });
                            },
                            (err) => {
                                reject();
                            })
                        })
                    );
                }
                Promise.all(promises)
                .then((results) => {
                    var myretval = [];
                    for (var myresult of results) {
                        if (myresult != null) {
                            myretval.push(myresult);
                        }
                    }
                    cb(null, myretval)
                })
                .catch((err) => {
                    cb(err, null)
                });    
            })
        })
    }

    Rentalservice.remoteMethod('getAvailableServices',{
        accepts: [{arg: 'start', type: 'date', required: true}, {arg: 'end', type: 'date', required: true},
            {arg:'name', type: 'string'}, {arg: 'address', type: 'string'}],
        http: {path: '/getAvailableServices', verb: 'get' },
        returns: {type: 'object', arg: 'retval'}
    })
};
