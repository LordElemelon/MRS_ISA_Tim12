/* eslint-disable indent */
/* eslint-disable max-len */
'use strict';

module.exports = function(Roomreservation) {
	Roomreservation.makeReservation = function(startDate, endDate, roomId, userId, price, hotelDiscountId, cb) {
		Roomreservation.beginTransaction({isolationLevel: Roomreservation.Transaction.READ_COMMITED}, function(err, tx) {
			const postgres = Roomreservation.app.dataSources.postgres;
			postgres.connector.execute("SELECT roomid FROM roomid WHERE roomid = '" + roomId + "' FOR UPDATE;", null, (err, result) => {
				if (err) {
					tx.rollback();
					cb(err, null);
				}	else {
					Roomreservation.app.models.Roomid.find({where: {roomId: roomId}}, {transaction: tx}, (err, res) => {
						if (err) {
							tx.rollback();
							cb(err, null);
						} else {
							Roomreservation.find({
								where: {
									roomId: roomId,
									startDate: {
										lte: endDate,
									},
									endDate: {
										gte: startDate,
									},
								}}, {transaction: tx}, (err, res) => {
									if (err) {
										tx.rollback();
										cb(err, null);
									}	else {
										if (res.length > 0) {
											tx.rollback();
											cb(new Error('Can not reserve on this date'), null);
										} else {
										  // TODO find the price manually, add special offers price etc etc
											Roomreservation.create({startDate: startDate, endDate: endDate,
												price: price, myuserId: userId, roomId: roomId, hotelDiscountId: hotelDiscountId}, {transaction: tx},
											(err, res) => {
												if (err) {
													tx.rollback();
													cb(err, null);
												} else {
													tx.commit();
													cb(null, res);
												}
											});
										}
									}
								});
							// console.log("usao");
							// setTimeout(() => {console.log('izas'); tx.commit();cb(null, res);}, 5000);
						}
					});
				}
			});
		});
	};

	Roomreservation.remoteMethod('makeReservation', {
        accepts: [{arg: 'startDate', type: 'date', required: true},
				  {arg: 'endDate', type: 'date', required: true},
				  {arg: 'roomId', type: 'string', required: true},
				  {arg: 'userId', type: 'string', required: false},
				  {arg: 'price', type: 'number', required: true},
          {arg: 'hotelDiscountId', type: 'string', required: false}],
        http: {path: '/makeReservation', verb: 'post'},
        returns: {type: 'object', arg: 'retval'},
    });

  Roomreservation.cancel = function(id, options, cb) {
    if (options.accessToken == null) {
      cb(new Error('No user logged in'), null);
      return;
    }
    var requestid = options.accessToken.userId.toString();
    Roomreservation.findById(id)
      .then((reservation) => {
        if (reservation == null) {
          throw new Error('Reservation with this id does not exist');
        }
        if (requestid !== reservation.myuserId) {
          throw new Error('User is not owner of the reservation');
        }
        var hours = (reservation.startDate - new Date()) / 36e5;
        if (hours < 72) {
          throw new Error('Too late to cancel reservation');
        }
        console.log(reservation.hotelDiscountId);
        if (reservation.hotelDiscountId) {
          console.log('1');
          return reservation.updateAttribute('myuserId', '', null);
        } else {
          console.log('2');
          return Roomreservation.destroyById(id);
        }
      })
      .then((result) => {
        cb(null, true);
      })
      .catch((err) => {
        cb(err, null);
      });
  };

  Roomreservation.remoteMethod('cancel', {
    accepts: [
      {arg: 'id', type: 'number', 'required': true},
      {arg: 'options', type: 'object', 'http': 'optionsFromRequest'}
    ],
    http: {path: '/cancel', verb: 'post' },
    returns: {type: 'object', arg: 'retval'}
	})
	
	Roomreservation.rateHotelAndRoom = function(id, roomRate, hotelRate, options, cb) {
		if (options.accessToken == null) {
			cb(new Error("No user logged in"),null);
			return;
		}
		var requestid = options.accessToken.userId;
		var myReservation;
		Roomreservation.beginTransaction({isolationLevel: Roomreservation.Transaction.READ_COMMITED})
		.then((tx) => {
			Roomreservation.findById(id)
			.then((result) => {
				if (result == null) {
					throw new Error("Reservation with this id does not exist");
				}
				if (result.rated) {
					throw new Error("User already rated this reservation");
				}
				if (requestid != result.myuserId) {
					throw new Error("User is not owner of the reservation");
				}
				var hours = (result.endDate - new Date()) / 36e5;
				if (result.endDate > new Date()) {
					throw new Error("Cannot rate before reservation finishes");
				}
				myReservation = result;
				return Roomreservation.app.models.room.findById(myReservation.roomId);
			})
			.then((result) => {
				var newCount = result.ratingCount + 1;
				var newRating = (result.rating * result.ratingCount + roomRate) / newCount;
				result.ratingCount = newCount;
				result.rating = newRating;
				return Roomreservation.app.models.room.replaceById(result.id, result, {transaction: tx});
			})
			.then((result) => {
				return Roomreservation.app.models.hotel.findById(result.hotelId);
			})
			.then((result) => {
				var newCount = result.ratingCount + 1;
				var newRating = (result.rating * result.ratingCount + hotelRate) / newCount;
				result.ratingCount = newCount;
				result.rating = newRating;
				return Roomreservation.app.models.hotel.replaceById(result.id, result, {transaction: tx});
			})
			.then((result) => {
				myReservation.rated = true;
				return Roomreservation.replaceById(myReservation.id, myReservation, {transaction: tx});
			})
			.then((result) => {
				tx.commit();
				cb(null, result);
			})
			.catch((err) => {
				tx.rollback();
				cb(err, null);
			})
		})
		.catch((err) => {
			cb(err, null);
		});

	}

	Roomreservation.remoteMethod('rateHotelAndRoom', {
		accepts: [
			{arg: 'id', type: 'number', required: true},
			{arg: 'roomRate', type: 'number', required: true},
			{arg: 'hotelRate', type: 'number', required: true},
			{arg: 'options', type: 'object', 'http': 'optionsFromRequest'}
		],
		http: {path: '/rateHotelAndRoom', verb: 'post' },
        returns: {type: 'object', arg: 'retval'}
	})
};
