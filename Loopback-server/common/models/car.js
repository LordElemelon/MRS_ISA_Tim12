'use strict';

module.exports = function(Car) {
    Car.observe('before save', function verifyForeignKeys(ctx, next){
        if (ctx.instance){
            var s = ctx.instance;
            var rentalServiceId = s.__data.rentalServiceId;
            Car.getApp((err, app) =>{
                app.models.RentalService.exists(rentalServiceId, (err, exists) =>{
                    if (err) next(err);
                    if (!exists)
                        return next(new Error('Bad foreign key: ' + rentalServiceId));
                    return next();
                });
            });
        }
    });
    Car.observe('after save', function saveInPostgre(ctx, next) {
        Car.app.models.Carid.create({'carId': ctx.instance.id}, (err, result) => {
            if (err) next(err);
            else next();
        });
    });
	
	Car.searchCars = function(startDate, endDate, make, seats, rentalservice, cb) {
		var search_object = {}
		if (make) {
			search_object.make = make;
		}
		if (seats) {
			search_object.seats = seats;
		}
		if (rentalservice) {
			Car.app.models.RentalService.find({'where': {'name': rentalservice}},
			(err, res) => {
				if (res.length != 0) {
					search_object.rentalServiceId = res[0].id;
					Car.continueCarSearch(search_object, startDate, endDate, cb);
				} else {
					cb(null, []);
				}
			});
			
		} else {
			Car.continueCarSearch(search_object, startDate, endDate, cb);
		}
	}
	
	Car.continueCarSearch = function (search_object, startDate, endDate, cb) {
		Car.app.models.Car.find({'where': search_object}, (err, res) => {
			var promises = []
			for (var car of res) {
				promises.push(
					new Promise(function(resolve, reject) {
						var mycar = car;
						Car.app.models.carReservation.find({
							where: {
								carsId:mycar.id,
								startDate: {
									lte: endDate
								},
								endDate: {
									gte: startDate
								}
							}
						})
						.then(
						(reservation_result) => {
							if (reservation_result.length != 0) {
								resolve(null);
							} else {
								resolve(mycar);
							}
						},
						(err) => {
							reject();
						});
					})
				);
			}
			Promise.all(promises)
			.then((result) => {
				var myretval = []
				for (var value of result) {
					if (value != null) {
						myretval.push(value);
					}
				}
				cb(null, myretval);
			})
			.catch((err) => {
				cb(err, null);
			})
		});
	}
	
	Car.remoteMethod('searchCars', {
		accepts: [
			{arg: 'startDate', type: 'date', required: true},
			{arg: 'endDate', type: 'date', required: true},
			{arg: 'make', type: 'string'},
			{arg: 'seats', type: 'number'},
			{arg: 'rentalservice', type: 'string'}
		], http: {path: '/searchCars', verb: 'post'},
		returns: {type: 'object', arg: 'retval'}	
	});


};
