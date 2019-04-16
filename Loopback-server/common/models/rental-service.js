'use strict';

module.exports = function(Rentalservice) {
    Rentalservice.getAvailableServices = function (start,  end, cb) {
        Rentalservice.find({})
        .then((result) => {
            Rentalservice.getApp((err, app) => {
                var to_do = result.length;
                if (to_do == 0) {
                    cb(null, "[]");
                    return;
                }
                var retval = [];
                var index = 0;
                var recursive_method = function(index) {
                    console.log("Index is " + index);
                    app.models.Car.find({'where': {rentalServiceId: result[index].id}})
                    .then((car_result) => {
                        if (car_result.length > 0) {
                            retval.push(result[index]);
                        }
                        to_do--;
                        if (to_do == 0) {
                            cb(null, retval)
                        } else {
                            recursive_method(index + 1);
                        }
                    })
                    .catch((err) => {
                        cb(null, "{'msg': 'nou mimsey'}");
                    });
                }
                recursive_method(index);
            });
        })
        .catch((err) => {
            cb(null, "{msg: 'Nou mimsey'}");
        });

        /*
            for (var index in result) {
                {
                    const temp_var = Object.assign({}, result[index]);
                    app.models.Car.find({'where': {rentalServiceId: temp_var.id}})
                    .then((car_result) => {
                        //will need to check reservations but for now, if there is a car
                        //its good enough for now
                        console.log(temp_var);
                        console.log(car_result);
                        console.log("To do " + to_do);
                        console.log("--------------------");
                        if (car_result.length > 0) {
                            retval.push(temp_var);
                        }
                        to_do--;
                        if (to_do == 0) {
                            cb(null, retval);
                        }
                    })
                    .catch((err) => {
                        cb(null, "{msg: 'Nou mimsey'}")
                    });
                }
            }
        */
    }
        
    
    Rentalservice.remoteMethod('getAvailableServices',{
        accepts: [{arg: 'start', type: 'date'}, {arg: 'end', type: 'date'}],
        http: {path: '/getAvailableServices', verb: 'get' },
        returns: {type: 'object', arg: 'retval'}
    })
};
