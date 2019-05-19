'use strict';

module.exports = function(Flight) {
  Flight.findAvailableFlights = function(origin, destination, takeoffDate, cb) {
    Flight.app.models.Flight.find({'where': {'origin': origin, 'destination': destination}},
    (err, res) => {
      validFlights = [];
      for (var flight of res) {
        let flightTakeoffDate = new Date(flight.takeoffDate);
        if (flightTakeoffDate.toLocaleDateString() == takeoffDate)
          validFlights.push(flight);
      }
      if (validFlights.length != 0) {

        //for each flight check seats reservation and add to list, perhaps using promises again?
        cb(null, validFlights);

      } else {
        cb(null, []);
      }
    });
  }
  
  Flight.remoteMethod('findAvailableFlights', {
    accepts: [
      {arg: 'origin', type: 'string', required: true},
      {arg: 'destination', type: 'string', required: true},
      {arg: 'takeoffDate', type: 'string', required: true},
    ],
    http: {path: '/findAvailableFlights', verb: 'get'},
    returns: {type: 'object', arg: 'retval'},
  });

  Flight.findAvailableSeats = function(flightId, cb) {
    Flight.app.models.Seat.find({'where': {'flightId': flightId}}, (err, res) => {
			var promises = []
			for (var seat of res) {
				promises.push(
					new Promise(function(resolve, reject) {
            var mySeat = seat;
						Flight.app.models.seatReservation.find({
							where: {
								seatId: mySeat.id 
							}
						})
						.then(
						(reservation_result) => {
							if (reservation_result.length != 0) {
								resolve(null);
							} else {
								resolve(mySeat);
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

  Flight.remoteMethod('findAvailableSeats', {
    accepts: [
      {arg: 'flightId', type: 'string', required: true},
    ],
    http: {path: '/findAvailableSeats', verb: 'get'},
    returns: {type: 'object', arg: 'retval'},
  });
};
