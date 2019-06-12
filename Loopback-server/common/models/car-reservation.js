'use strict';

module.exports = function(Carreservation) {

	Carreservation.makeReservation = function(startDate, endDate, carId, userId, price, rentalid, usePoints, cb) {

		var myPrices;

		Carreservation.beginTransaction({isolationLevel: Carreservation.Transaction.READ_COMMITED}, function(err, tx){
			const postgres = Carreservation.app.dataSources.postgres;
			postgres.connector.execute("SELECT carid FROM carid WHERE carid = $1 FOR UPDATE;", ['"' + carId + '"'], {transaction: tx}, (err, result) => {
				if (err) {
					tx.rollback();
					cb(err, null);
					return;
				}

				Carreservation.app.models.Carid.find({where: {carId : carId}} , {transaction:tx})
				.then((result) => {
					return Carreservation.find({
						where: {
							carsId: carId,
							startDate: {
								lte: endDate
							},
							endDate: {
								gte: startDate
							}
						}}, {transaction: tx});
				})
				.then((result) => {
					if (result.length > 0) {
						throw new Error("Cannot reserve on this date");
					}
					return Carreservation.app.models.CarPrice.find({where: {rentalServiceId: rentalid,
						start: {lte: startDate}}, order: "start DESC"})
				})
				.then((result) => {
					myPrices = result;
					if (myPrices.length == 0) throw new Error("No price defined for this vehicle");
					return Carreservation.app.models.car.findById(carId);
				})
				.then((car) => {
					return Carreservation.matchCarWithPrice(myPrices, car, startDate, endDate, price, usePoints, userId, tx)
				})
				.then((matched) => {
					if (!matched) throw new Error("Price sent does not match");
					return Carreservation.create({startDate: startDate, endDate: endDate,
						price: price, myuserId: userId, carsId: carId, rentalServiceId: rentalid,
						 rated: false, isSpecialOffer: false}, {transaction: tx});
				})
				.then((result) => {
					tx.commit();
					cb(null, result);
				})
				.catch((err) => {
					tx.rollback();
					cb(err, null);
				});				
			});
		});
	
	}	

	Carreservation.matchCarWithPrice = function(prices, car, startDate, endDate, price, usePoints, userId, tx) {

		var myPromise = new Promise(function(resolve, reject) {
			if (!usePoints) {
				var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
				var days = 1 + Math.round(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)));
				//console.log("Pokusana: " + price);
				//console.log("Sracunata: " + prices[0]['cat' + car.category + 'Price']);
				resolve(prices[0]['cat' + car.category + 'Price'] * days == price);
			} else {
				Carreservation.app.models.myuser.findById(userId)
				.then((result) => {
					if (result.bonusPoints < 100) throw new Error("User does not have enough points");
					var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
					var days = 1 + Math.round(Math.abs((startDate.getTime() - endDate.getTime())/(oneDay)));
					var to_check = days * prices[0]['cat' + car.category + 'Price'];
					to_check = Math.round(to_check * 0.9);

					//console.log("Pokusana: " + to_check);
					//console.log("Potrebna: " + price);

					if (to_check != price) throw new Error("Price does not match");
					result.bonusPoints -= 100;
					return Carreservation.app.models.myuser.replaceById(result.id, result, {transaction: tx});
				})
				.then((result) => {
					resolve(true);
				})
				.catch((err) => {
					reject(err);
				})
			}
		});
		return myPromise;
	}
	
	Carreservation.remoteMethod('makeReservation',{
        accepts: [{arg: 'startDate', type: 'date', required: true}, 
				  {arg: 'endDate', type: 'date', required: true},
				  {arg:'carId', type: 'string', required: true},
				  {arg:'userId', type: 'string', required: true},
				  {arg: 'price', type: 'number', required: true},
				  {arg: 'rentalid', type: 'string', required: true},
				  {arg: 'usePoints', type: 'boolean', required: true}],
        http: {path: '/makeReservation', verb: 'post' },
        returns: {type: 'object', arg: 'retval'}
	})



	
	Carreservation.cancel = function(id, options, cb) {
		if (options.accessToken == null) {
			cb(new Error("No user logged in"),null);
			return;
		}
		var requestid = options.accessToken.userId;
		Carreservation.findById(id)
		.then((result) => {
			if (result == null) {
				throw new Error("Reservation with this id does not exist");
			}
			if (requestid != result.myuserId) {
				throw new Error("User is not owner of the reservation");
			}
			var hours = (result.startDate - new Date()) / 36e5;
			if (hours < 72) {
				throw new Error("Too late to cancel reservation");
			}
			if (!result.isSpecialOffer) {
				Carreservation.destroyById(id)
				.then((result) => {
					cb(null, true);
				})
				.catch((err) => {
					cb(err, null);
				})
			} else {
				Carreservation.updateAll({id: result.id}, {myuserId: null})
				.then((result) => {
					if (result.count != 1) throw new Error("Cancellation failed, updated more than one");
					return Carreservation.app.models.carSpecialOffer.updateAll({carReservationsId: id}, {myuserId: null})
				})
				.then((result) => {
					if (result.count != 1) throw new Error("Cancellation failed, updated more than one");
					cb(null, true);
				})
				.catch((err) => {
					cb(err, null);
				})
			}
		})
		.catch((err) => {
			cb(err, null);
		})
	}

	Carreservation.remoteMethod('cancel', {
		accepts: [
			{arg: 'id', type: 'number', 'required': true},
			{arg: 'options', type: 'object', 'http': 'optionsFromRequest'}
		],
		http: {path: '/cancel', verb: 'post' },
        returns: {type: 'object', arg: 'retval'}
	})


		
	Carreservation.rateServiceAndCar = function(id, carRate, rentalRate, options, cb) {
		if (options.accessToken == null) {
			cb(new Error("No user logged in"),null);
			return;
		}
		var requestid = options.accessToken.userId;
		var myReservation;
		Carreservation.beginTransaction({isolationLevel: Carreservation.Transaction.READ_COMMITED})
		.then((tx) => {
			Carreservation.findById(id)
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
				return Carreservation.app.models.car.findById(myReservation.carsId);
			})
			.then((result) => {
				var new_count = result.ratingCount + 1;
				var new_rating = (result.rating * result.ratingCount + carRate) / new_count;
				result.ratingCount = new_count;
				result.rating = new_rating;
				return Carreservation.app.models.car.replaceById(result.id, result, {transaction: tx});
			})
			.then((result) => {
				return Carreservation.app.models.rentalService.findById(myReservation.rentalServiceId)
			})
			.then((result) => {
				var new_count = result.ratingCount + 1;
				var new_rating = (result.rating * result.ratingCount + rentalRate) / new_count;
				result.ratingCount = new_count;
				result.rating = new_rating;
				return Carreservation.app.models.rentalService.replaceById(result.id, result, {transaction: tx});
			})
			.then((result) => {
				myReservation.rated = true;
				return Carreservation.replaceById(myReservation.id, myReservation, {transaction: tx});
			})
			.then((result) => {
				return Carreservation.app.models.myuser.findById(requestid);
			})
			.then((result) => {
				var new_points = Math.round(myReservation.price / 10) + result.bonusPoints;
				result.bonusPoints = new_points;
				return Carreservation.app.models.myuser.replaceById(result.id, result, {transaction: tx});
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
		})
	}

	Carreservation.remoteMethod('rateServiceAndCar', {
		accepts: [
			{arg: 'id', type: 'number', required: true},
			{arg: 'carRate', type: 'number', required: true},
			{arg: 'rentalRate', type: 'number', required: true},
			{arg: 'options', type: 'object', 'http': 'optionsFromRequest'}
		],
		http: {path: '/rateServiceAndCar', verb: 'post' },
        returns: {type: 'object', arg: 'retval'}
	})

	Carreservation.getYearlyReport = function(startDate, endDate, rentalServiceId, cb) {
		var years = Carreservation.generateYearsArray(startDate, endDate);
		var baseNum = startDate.getYear();
		var retval = {};
		Carreservation.find({
			where: {
				startDate: {
					lte: endDate
				},
				endDate: {
					gte: startDate
				},
				rentalServiceId: rentalServiceId
			}
		})
		.then((result) => {
			retval.labels = years;
			retval.sums = []
			for (let year of retval.labels) {
				retval.sums.push(0);
			}
			for (let reservation of result) {
				if (reservation.myuserId != null) {
					var tempyear = reservation.startDate.getYear();
					retval.sums[tempyear - baseNum] += reservation.price;
				}
			}
			cb(null, retval);
		})
	}

	Carreservation.generateYearsArray = function(startDate, endDate) {
		var retVal = [];
		var startYear = startDate.getYear();
		var endYear = endDate.getYear();
		var i = startYear;
		for (; i <= endYear; i++) {
			retVal.push((1900 + i).toString());
		}
		return retVal;
	}

	Carreservation.remoteMethod('getYearlyReport', {
		accepts: [{arg: 'startDate', type: 'date', required: true},
				  {arg: 'endDate', type: 'date', required: true},
				  {arg: 'rentalServiceId', type: 'string', required: true}],
		http: {path: '/getYearlyReport', verb: 'get'},
		returns: {type: 'object', arg: 'retval'}
	});

	Carreservation.getMonthlyReport = function(startDate, endDate, rentalServiceId, cb) {
		var monthArray = Carreservation.generateMonthArray(startDate, endDate);
		var baseNum = startDate.getYear() * 12 + startDate.getMonth();
		var retval = {};
		Carreservation.find({
			where: {
				startDate: {
					lte: endDate
				},
				endDate: {
					gte: startDate
				},
				rentalServiceId: rentalServiceId
			}
		})
		.then((result) => {
			retval.labels = monthArray;
			retval.sums = [];
			for (let month of retval.labels) {
				retval.sums.push(0);
			}
			for (let reservation of result) {
				if (reservation.myuserId != null) {
					var tempNum = reservation.startDate.getYear() * 12 + reservation.startDate.getMonth();
					retval.sums[tempNum - baseNum] += reservation.price;
				}
			}
			cb(null, retval);
		})
		
	}

	Carreservation.generateMonthArray = function (startDate, endDate) {
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
	}

	Carreservation.remoteMethod('getMonthlyReport', {
		accepts: [{arg: 'startDate', type: 'date', required: true},
				  {arg: 'endDate', type: 'date', required: true},
				  {arg: 'rentalServiceId', type: 'string', required: true}],
		httP: {path: '/getMonthlyReport', verb: 'get'},
		returns: {type: 'objects', arg: 'retval'}
	});

	Carreservation.getWeeklyReport = function (startDate, endDate, rentalServiceId, cb) {
		startDate.setDate(startDate.getDate() - startDate.getDay());
		if (endDate.getDay() != 0) {
			endDate.setDate(endDate.getDate() + 7 - endDate.getDay());
		}
		var weeks = Carreservation.generateWeekArray(startDate, endDate);
		var retval = {};
		Carreservation.find({
			where: {
				startDate: {
					lte: endDate
				},
				endDate: {
					gte: startDate
				},
				rentalServiceId: rentalServiceId
			}
		})
		.then((result) => {
			retval.labels = weeks
			retval.sums = []
			for (let week of retval.labels) {
				retval.sums.push(0);
			}
			for (let reservation of result) {
				if (reservation.myuserId != null) {
					var tempNum = Math.floor((reservation.startDate - startDate)/(1000 * 60 * 60 * 24 * 7));
					retval.sums[tempNum] += reservation.price;
				}
			}
			cb(null, retval);
		})
	}

	Carreservation.generateWeekArray = function (startDate, endDate) {
		var monthStrings = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		var retVal = []
		var weekCount = (endDate - startDate)/(1000 * 60 * 60 * 24 * 7)
		var i = 0;
		var currentDate = new Date(startDate.getTime());
		for (; i < weekCount; i++) {
			var label = monthStrings[currentDate.getMonth()] + ' ' + currentDate.getDate() + ' - '
			currentDate.setDate(currentDate.getDate() + 7);
			label += monthStrings[currentDate.getMonth()] + ' ' + currentDate.getDate()
			retVal.push(label);
		}
		return retVal;
	}

	Carreservation.remoteMethod('getWeeklyReport', {
		accepts: [{arg: 'startDate', type: 'date', required: true},
				  {arg: 'endDate', type: 'date', required: true},
				  {arg: 'rentalServiceId', type: 'string', required: true}],
		httP: {path: '/getWeeklyReport', verb: 'get'},
		returns: {type: 'objects', arg: 'retval'}
	});

	Carreservation.getOccupancyReport =  function (startDate, endDate, rentalServiceId, cb) {
		var days = Carreservation.generateDayArray(startDate, endDate);
		var retval = {};
		Carreservation.find({
			where: {
				startDate: {
					lte: endDate
				},
				endDate: {
					gte: startDate
				},
				rentalServiceId: rentalServiceId
			}
		})
		.then((result) => {
			retval.labels = days;
			retval.sums = [];
			var baseDate = startDate;
			for (let label of retval.labels) {
				retval.sums.push(0);
			}
			var i;
			for (let reservation of result) {
				var startDiff = Math.floor((reservation.startDate - baseDate) / (1000 * 60 * 60 * 24));
				var endDiff = Math.floor((reservation.endDate - baseDate) / (1000 * 60 * 60 * 24));
				var endDiff = Math.min(endDiff, retval.labels.length - 1);
				for (i = startDiff; i <= endDiff; i++) {
					retval.sums[i] += 1;
				}
			}
			Carreservation.app.models.car.count({rentalServiceId: rentalServiceId})
			.then((result) => {
				retval.totalVehicles = result;
				cb(null, retval);
			})
			.catch((err) => {
				cb(err, null);
			})
		})
		
	}

	Carreservation.generateDayArray = function(startDate, endDate) {
		var tempDate = new Date(startDate.getTime());
		var retVal = [];
		while (tempDate.getTime() <= endDate.getTime()) {
			retVal.push(tempDate.toDateString());
			tempDate.setDate(tempDate.getDate() + 1);
		}
		return retVal;
	}

	Carreservation.remoteMethod('getOccupancyReport', {
		accepts: [{arg: 'startDate', type: 'date', required: true},
				  {arg: 'endDate', type: 'date', required: true},
				  {arg: 'rentalServiceId', type: 'string', required: true}],
		http: {path: '/getOccupancyReport', verb: 'get'},
		returns: {type: 'objects', arg: 'retval'}
	});

	Carreservation.getRatingReport = function(rentalServiceId, cb) {
		var retval = {};
		Carreservation.app.models.rentalService.findById(rentalServiceId)
		.then((result) => {
			retval.rentalService = {};
			retval.rentalService.name = result.name;
			retval.rentalService.rating = result.rating.toFixed(2);
			retval.rentalService.ratingCount = result.ratingCount;
			return Carreservation.app.models.car.find({where: {rentalServiceId: rentalServiceId}});
		})
		.then((result) => {
			retval.cars = [];
			for (let car of result) {
				retval.cars.push(
					{
						registration: car.registration,
						rating: car.rating.toFixed(2),
						ratingCount: car.ratingCount
					}
				)
			}
			cb(null, retval);
		})
		.catch((err) => {
			cb(err, null);
		})
	}

	Carreservation.remoteMethod('getRatingReport', {
		accepts: [{arg: 'rentalServiceId', type: 'string', required: true}],
		http: {path: '/getRatingReport', verb: 'get'},
		returns: {type: 'objects', arg: 'retval'}
	});




};
