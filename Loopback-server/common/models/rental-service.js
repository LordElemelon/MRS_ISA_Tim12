/* eslint-disable max-len */
'use strict';

module.exports = function(Rentalservice) {
    Rentalservice.getAvailableServices = function (start,  end, name, address, cb) {
        var start_string = new Date(start).toISOString().slice(0, 19).replace('T', ' ');
        var end_string = new Date(end).toISOString().slice(0, 19).replace('T', ' ');
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
                            const mongo = Rentalservice.app.dataSources.MongoDB;
                            var carCollection = mongo.connector.collection(app.models.Car.modelName);
                            carCollection.count({'rentalServiceId': myservice.id})
                            .then((car_count) => {
                                if (car_count == 0) {
                                    resolve(null);
                                } else {
                                     var query_string = "SELECT COUNT (DISTINCT carsid) FROM carreservation WHERE startdate < DATE(\'" + end_string + "\') " +
                                     " and enddate > (\'" + start_string +  "\') and rentalserviceid = '" + myservice.id + "';";
                                     const postgres = Rentalservice.app.dataSources.postgres;
                                     postgres.connector.execute(query_string, null, (err, result) => {
                                         if (result[0].count < car_count) {
                                             resolve(myservice);
                                         } else {
                                             resolve(null);
                                         }
                                    });
                                }
                            })
                            .catch((err) => {
                                reject();
                            });
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

    Rentalservice.observe('before save', function findLatLong(ctx, next) {
        let instance = ctx.instance.__data;
        let address = instance.address;
        let queryString = address;
        let locationId = instance.locationId;
		
		if (locationId != null && locationId != undefined) {
			Rentalservice.app.models.Location.findById(locationId, (err, result) => {
				if (err) next(new Error('Something went wrong'));
				else {
				  if (result != null) {
					queryString = result.country + ' ' + result.city + ' ' + address;
				  }
				  var geoService = Rentalservice.app.dataSources.geoRest;
				  geoService.geocode(queryString, (err, result) => {
					if (err) next(new Error('Something went wrong'));
					else if (result.length > 0) {
					  instance.latitude = result[0].lat;
					  instance.longitude = result[0].lng;
					  next();
					} else {
					  instance.latitude = 0;
					  instance.longitude = 0;
					  next();
					}
				  });
				}
			});
	    } else {
			next();
	    }
    });
};
