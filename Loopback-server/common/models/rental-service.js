'use strict';

module.exports = function(Rentalservice) {
    Rentalservice.getAvailableServices = function (start,  end, name, address, cb) {
        var searchObject = {};
        if (typeof name != 'undefined') {
            searchObject.name = name;
        }
        if (typeof address != 'undefined') {
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
