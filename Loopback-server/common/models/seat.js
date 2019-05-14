'use strict';

module.exports = function(Seat) {
  Seat.observe('before save', function verifyForeignKeys(ctx, next) {
    if (ctx.instance) {
      var s = ctx.instance;
      if (s.__data == {}) {
        let error = new Error('No data sent');
        error.status = 500;
        next(error);
      } else {
        var flightId = s.__data.flightId;
        if (flightId === null || flightId === undefined) {
          var error = new Error('flight id not sent');
          error.status = 500;
          next(error);
        } else {
          Seat.getApp((err, app) => {
            app.models.Flight.exists(flightId, (err, exists) => {
              if (err) next(err);
              if (!exists) {
                return next(new Error('Bad foreign key for flight: ' + flightId));
              } else {
                return next();
              }
            });
          });
        }
      }
    }
  });
  Seat.observe('after save', function saveInPostgre(ctx, next) {
    Seat.app.models.Seatid.create({'seatId': ctx.instance.id}, (err, result) => {
      if (err) next(err);
      else next();
    });
  });

  Seat.findAvailableSeats = function(flightId, cb) {
    Seat.app.models.Seat.find({'where': {'flightId': flightId}},
    (err, res) => {
      validFlights = [];
      for (var flight of res) {
        let flightTakeoffDate = new Date(flight.takeoffDate);
        if (flightTakeoffDate.toLocaleDateString() == takeoffDate)
          validFlights.push(flight);
      }
      if (validFlights.length != 0) {



      } else {
        cb(null, []);
      }
    });
	}
	
	Car.continueCarSearch = function (search_object, cb) {
		Car.app.models.Car.find({'where': search_object}, (err, res) => {
			var promises = []
			for (var car of res) {
				promises.push(
					new Promise(function(resolve, reject) {
						var mycar = car;
						Car.app.models.carReservation.find({
							where: {
								carsId: '\"' + mycar.id + '\"',
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

  Seat.remoteMethod('findAvailableSeats', {
    accepts: [
      {arg: 'origin', type: 'string', required: true},
      {arg: 'destination', type: 'string', required: true},
      {arg: 'takeoffDate', type: 'string', required: true},
    ],
    http: {path: '/findAvailableSeats', verb: 'get'},
    returns: {type: 'object', arg: 'retval'},
  });

};
