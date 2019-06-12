/* eslint-disable indent */
/* eslint-disable max-len */
'use strict';

module.exports = function(Roomreservation) {
	Roomreservation.makeReservation = function(startDate, endDate, roomId, userId, price, hotelDiscountId, hotelId, usePoints, cb) {
		Roomreservation.beginTransaction({isolationLevel: Roomreservation.Transaction.READ_COMMITED}, function(err, tx) {
			const postgres = Roomreservation.app.dataSources.postgres;
			postgres.connector.execute('SELECT roomid FROM roomid WHERE roomid = $1 FOR UPDATE;', ['"' + roomId + '"'], {transaction: tx}, (err, result) => {
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
								},
              }, {transaction: tx}, (err, res) => {
                if (err) {
                  tx.rollback();
                  cb(err, null);
                }	else {
                  if (res.length > 0) {
                    tx.rollback();
                    cb(new Error('Can not reserve on this date'), null);
                  } else {
                    // TODO find the price manually, add special offers price etc etc
                    Roomreservation.app.models.RoomPrice.findOne({
                      where: {startDate: {lte: startDate}, roomId: roomId},
                      order: 'startDate DESC',
                    })
                      .then(roomPrice => {
                        const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
                        const numDays = Math.round(Math.abs((new Date(startDate).getTime() - new Date(endDate).getTime()) / (oneDay)));
                        let priceAllDays = 0;
                        if (hotelDiscountId == '' || hotelDiscountId == null) {
                          priceAllDays = roomPrice.price * numDays;
                        } else {
                          priceAllDays = price * numDays;
                        }
                        if (priceAllDays !== price && (hotelDiscountId == null && hotelDiscountId == '')) {
                          tx.rollback();
                          cb(new Error('The price has changed'), null);
                          return;
                        }
                        if (usePoints) {
                          priceAllDays = Math.round(priceAllDays * 0.9);
                          Roomreservation.app.models.myuser.findById(userId)
                          .then((result) => {
                            if (result.bonusPoints < 100) {
                              tx.rollback();
                              cb(new Error("User does not have enough bonus points"), null);
                              return;
                            }
                            result.bonusPoints -= 100;
                            Roomreservation.app.models.myuser.replaceById(result.id, result, {transaction: tx})
                            .then((result) => {
                              Roomreservation.create({
                                startDate: startDate, endDate: endDate,
                                price: priceAllDays, myuserId: userId, roomId: roomId, hotelDiscountId: hotelDiscountId,
                                hotelId: hotelId
                              }, {transaction: tx},
                              (err, res) => {
                                if (err) {
                                  tx.rollback();
                                  cb(err, null);
                                } else {
                                  tx.commit();
                                  cb(null, res);
                                }
                              });
                            })
                          })
                          .catch((err) => {
                            tx.rollback();
                            cb(new Error("User not found"), null);
                          });
                        } else {
                          Roomreservation.create({
                            startDate: startDate, endDate: endDate,
                            price: priceAllDays, myuserId: userId, roomId: roomId, hotelDiscountId: hotelDiscountId,
                            hotelId: hotelId,
                          }, {transaction: tx},
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
          {arg: 'hotelDiscountId', type: 'string', required: false},
          {arg: 'hotelId', type: 'string', required: true},
          {arg: 'usePoints', type:'boolean',  required: true}],
        http: {path: '/makeReservation', verb: 'post'},
        returns: {type: 'object', arg: 'retval'},
    });

	Roomreservation.quickReservation = function(reservationId, myuserId, roomId, cb) {
	  Roomreservation.beginTransaction({isolationLevel: Roomreservation.Transaction.READ_COMMITED}, function(err, tx) {
      const postgres = Roomreservation.app.dataSources.postgres;
      postgres.connector.execute('SELECT roomid FROM roomid WHERE roomid = $1 FOR UPDATE;', ['"' + roomId + '"'], {transaction: tx}, (err, result) => {
        if (err) {
          tx.rollback();
          cb(err, null);
        } else {
          Roomreservation.findOne({where: {id: reservationId}}, {transaction: tx}, (err, reservation) => {
            if (err) {
              tx.rollback();
              cb(err, null);
            } else {
              reservation.updateAttribute('myuserId', myuserId);
              tx.commit();
              cb(null, reservation);
            }
          });
        }
      });
    });
  };

	Roomreservation.remoteMethod('quickReservation', {
	  accepts: [{arg: 'reservationId', type: 'number', required: true},
      {arg: 'myuserId', type: 'string', required: true},
      {arg: 'roomId', type: 'string', required: true}],
    http: {path: '/quickReservation', verb: 'post'},
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
        if (reservation.hotelDiscountId) {
          return reservation.updateAttribute('myuserId', null, null);
        } else {
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
      {arg: 'options', type: 'object', 'http': 'optionsFromRequest'},
    ],
    http: {path: '/cancel', verb: 'post'},
    returns: {type: 'object', arg: 'retval'},
	});

	Roomreservation.rateHotelAndRoom = function(id, roomRate, hotelRate, options, cb) {
		if (options.accessToken == null) {
			cb(new Error('No user logged in'), null);
			return;
		}
		var requestid = options.accessToken.userId;
		var myReservation;
		Roomreservation.beginTransaction({isolationLevel: Roomreservation.Transaction.READ_COMMITED})
		.then((tx) => {
			Roomreservation.findById(id)
			.then((result) => {
				if (result == null) {
					throw new Error('Reservation with this id does not exist');
				}
				if (result.rated) {
					throw new Error('User already rated this reservation');
				}
				if (requestid != result.myuserId) {
					throw new Error('User is not owner of the reservation');
				}
				var hours = (result.endDate - new Date()) / 36e5;
				if (result.endDate > new Date()) {
					throw new Error('Cannot rate before reservation finishes');
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
        return Roomreservation.app.models.myuser.findById(requestid);
				
      })
      .then((result) => {
        var new_points = Math.round(myReservation.price / 10) + result.bonusPoints;
        result.bonusPoints = new_points;
        return Roomreservation.app.models.myuser.replaceById(result.id, result, {transaction: tx});
      })
      .then((result) => {
        tx.commit();
				cb(null, result);
      })
			.catch((err) => {
				tx.rollback();
				cb(err, null);
			});
		})
		.catch((err) => {
			cb(err, null);
		});
	};

	Roomreservation.remoteMethod('rateHotelAndRoom', {
		accepts: [
			{arg: 'id', type: 'number', required: true},
			{arg: 'roomRate', type: 'number', required: true},
			{arg: 'hotelRate', type: 'number', required: true},
			{arg: 'options', type: 'object', 'http': 'optionsFromRequest'},
		],
		http: {path: '/rateHotelAndRoom', verb: 'post'},
        returns: {type: 'object', arg: 'retval'},
	});

  Roomreservation.getYearlyReport = function(startDate, endDate, hotelId, type, cb) {
    var years = Roomreservation.generateYearsArray(startDate, endDate);
    var baseNum = startDate.getYear();
    var retval = {};
    Roomreservation.find({
      where: {
        startDate: {
          lte: endDate,
        },
        endDate: {
          gte: startDate,
        },
      },
    })
      .then((result) => {
        retval.labels = years;
        retval.sums = [];
        for (let year of retval.labels) {
          retval.sums.push(0);
        }
        for (let reservation of result) {
          var tempyear = reservation.startDate.getYear();
          retval.sums[tempyear - baseNum] += Math.pow(reservation.price, type);
        }
        cb(null, retval);
      });
  };

  Roomreservation.generateYearsArray = function(startDate, endDate) {
    var retVal = [];
    var startYear = startDate.getYear();
    var endYear = endDate.getYear();
    var i = startYear;
    for (; i <= endYear; i++) {
      retVal.push((1900 + i).toString());
    }
    return retVal;
  };

  Roomreservation.remoteMethod('getYearlyReport', {
    accepts: [{arg: 'startDate', type: 'date', required: true},
      {arg: 'endDate', type: 'date', required: true},
      {arg: 'hotelId', type: 'string', required: true},
      {arg: 'type', type: 'number', required: true}],
    http: {path: '/getYearlyReport', verb: 'get'},
    returns: {type: 'object', arg: 'retval'},
  });

  Roomreservation.getMonthlyReport = function(startDate, endDate, hotelId, type, cb) {
    var monthArray = Roomreservation.generateMonthArray(startDate, endDate);
    var baseNum = startDate.getYear() * 12 + startDate.getMonth();
    var retval = {};
    Roomreservation.find({
      where: {
        startDate: {
          lte: endDate,
        },
        endDate: {
          gte: startDate,
        },
      },
    })
      .then((result) => {
        retval.labels = monthArray;
        retval.sums = [];
        for (let month of retval.labels) {
          retval.sums.push(0);
        }
        for (let reservation of result) {
          var tempNum = reservation.startDate.getYear() * 12 + reservation.startDate.getMonth();
          retval.sums[tempNum - baseNum] += Math.pow(reservation.price, type);
        }
        cb(null, retval);
      });
  };

  Roomreservation.generateMonthArray = function(startDate, endDate) {
    var monthStrings = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var start = startDate.getYear() * 12 + startDate.getMonth();
    var end = endDate.getYear() * 12 + endDate.getMonth();
    var retval = [];
    var i = start;
    for (; i <= end; i++) {
      var tempYear = (Math.floor(i / 12) + 1900).toString();
      var tempMonth = monthStrings[i % 12];
      retval.push(tempYear + ' ' + tempMonth);
    }
    return retval;
  };

  Roomreservation.remoteMethod('getMonthlyReport', {
    accepts: [{arg: 'startDate', type: 'date', required: true},
      {arg: 'endDate', type: 'date', required: true},
      {arg: 'hotelId', type: 'string', required: true},
      {arg: 'type', type: 'number', required: true}],
    http: {path: '/getMonthlyReport', verb: 'get'},
    returns: {type: 'object', arg: 'retval'},
  });

  Roomreservation.getWeeklyReport = function(startDate, endDate, hotelId, type, cb) {
    startDate.setDate(startDate.getDate() - startDate.getDay());
    if (endDate.getDay() != 0) {
      endDate.setDate(endDate.getDate() + 7 - endDate.getDay());
    }
    var weeks = Roomreservation.generateWeekArray(startDate, endDate);
    var retval = {};
    Roomreservation.find({
      where: {
        startDate: {
          lte: endDate,
        },
        endDate: {
          gte: startDate,
        },
      },
    })
      .then((result) => {
        retval.labels = weeks;
        retval.sums = [];
        for (let week of retval.labels) {
          retval.sums.push(0);
        }
        for (let reservation of result) {
          var tempNum = Math.floor((reservation.startDate - startDate) / (1000 * 60 * 60 * 24 * 7));
          retval.sums[tempNum] += Math.pow(reservation.price, type);
        }
        cb(null, retval);
      });
  };

  Roomreservation.generateWeekArray = function(startDate, endDate) {
    var monthStrings = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var retVal = [];
    var weekCount = (endDate - startDate) / (1000 * 60 * 60 * 24 * 7);
    var i = 0;
    var currentDate = new Date(startDate.getTime());
    for (; i < weekCount; i++) {
      var label = monthStrings[currentDate.getMonth()] + ' ' + currentDate.getDate() + ' - ';
      currentDate.setDate(currentDate.getDate() + 7);
      label += monthStrings[currentDate.getMonth()] + ' ' + currentDate.getDate();
      retVal.push(label);
    }
    return retVal;
  };

  Roomreservation.remoteMethod('getWeeklyReport', {
    accepts: [{arg: 'startDate', type: 'date', required: true},
      {arg: 'endDate', type: 'date', required: true},
      {arg: 'hotelId', type: 'string', required: true},
      {arg: 'type', type: 'number', required: true}],
    http: {path: '/getWeeklyReport', verb: 'get'},
    returns: {type: 'object', arg: 'retval'},
  });


  Roomreservation.getRatingReport = function(hotelId, cb) {
		var retval = {};
		Roomreservation.app.models.hotel.findById(hotelId)
		.then((result) => {
			retval.hotel = {};
			retval.hotel.name = result.name;
			retval.hotel.rating = result.rating.toFixed(2);
			retval.hotel.ratingCount = result.ratingCount;
			return Roomreservation.app.models.room.find({where: {hotelId: hotelId}});
		})
		.then((result) => {
			retval.rooms = [];
			for (let room of result) {
				retval.rooms.push(
					{
						number: room.number,
						rating: room.rating.toFixed(2),
						ratingCount: room.ratingCount
					}
				)
			}
			cb(null, retval);
		})
		.catch((err) => {
			cb(err, null);
		})
	}

	Roomreservation.remoteMethod('getRatingReport', {
		accepts: [{arg: 'hotelId', type: 'string', required: true}],
		http: {path: '/getRatingReport', verb: 'get'},
		returns: {type: 'objects', arg: 'retval'}
	});
};
