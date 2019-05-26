'use strict';

module.exports = function(Carreservation) {

	Carreservation.makeReservation = function(startDate, endDate, carId, userId, price, rentalid, cb) {
		Carreservation.beginTransaction({isolationLevel: Carreservation.Transaction.READ_COMMITED}, function(err, tx){
			const postgres = Carreservation.app.dataSources.postgres;
			postgres.connector.execute("SELECT carid FROM carid WHERE carid = '" + carId + "' FOR UPDATE;", null, (err, result) => {
				if (err) {
					tx.rollback();
					cb(err, null);
				}
				else{
					Carreservation.app.models.Carid.find({where: {carId: carId}}, {transaction: tx}, (err, res) => {
						if (err){
							tx.rollback();
							cb(err, null);
						}
						else{
							//var car_promise = Carreservation.apnbvcnbcp.models.car.find({where: {id: '\"' + carId + '\"'}});
							Carreservation.find({
								where: {
									carsId: carId,
									startDate: {
										lte: endDate
									},
									endDate: {
										gte: startDate
									}
								}}, {transaction: tx}, (err, res) => {
									if (err) {
										tx.rollback();
										cb(err, null);
									}
									else{
										if (res.length > 0){
											tx.rollback();
											cb(new Error('Can not reserve on this date'), null);
										}else{
											//console.log(rentalid);
											Carreservation.create({startDate: startDate, endDate: endDate, isSpecialOffer: false,
												price: price, myuserId: userId, carsId: carId, rentalServiceId: rentalid}, {transaction: tx},
											(err, res) => {
												if (err) {
													tx.rollback();
													cb(err, null);
												}else{
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
	}
	
	Carreservation.remoteMethod('makeReservation',{
        accepts: [{arg: 'startDate', type: 'date', required: true}, 
				  {arg: 'endDate', type: 'date', required: true},
				  {arg:'carId', type: 'string', required: true},
				  {arg:'userId', type: 'string', required: true},
				  {arg: 'price', type: 'number', required: true},
				  {arg: 'rentalid', type: 'string', required: true}],
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
				var tempyear = reservation.startDate.getYear();
				retval.sums[tempyear - baseNum] += reservation.price;
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
				var tempNum = reservation.startDate.getYear() * 12 + reservation.startDate.getMonth();
				retval.sums[tempNum - baseNum] += reservation.price;
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
				
				var tempNum = Math.floor((reservation.startDate - startDate)/(1000 * 60 * 60 * 24 * 7));
				retval.sums[tempNum] += reservation.price;
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

	


};
