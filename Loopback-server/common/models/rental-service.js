'use strict';

module.exports = function(Rentalservice) {
    Rentalservice.getAvailableServices = function (start,  end, cb) {
        Rentalservice.find({})
        .then((result) => {
            Rentalservice.getApp((err, app) => {
                var promises = []
                for (var service of result) {
                    promises.push(
                        new Promise(function(resolve, reject) {
                            var myservice = service;
                            app.models.Car.find({'where': {rentalServiceId: myservice.id}})
                            .then((car_result) =>{
                                if (car_result.length != 0) {
                                    resolve(myservice); 
                                } 
                                else {
                                    resolve(null);
                                }
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
                    cb(null, "{}")
                });    
            })
        })
    }

    Rentalservice.remoteMethod('getAvailableServices',{
        accepts: [{arg: 'start', type: 'date'}, {arg: 'end', type: 'date'}],
        http: {path: '/getAvailableServices', verb: 'get' },
        returns: {type: 'object', arg: 'retval'}
    })
};
