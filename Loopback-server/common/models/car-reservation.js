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
											console.log(rentalid);
											Carreservation.create({startDate: startDate, endDate: endDate,
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
	
	Carreservation.getYearlyReport = function(startDate, endDate, rentalServiceId, cb) {
		var years = [];
		var startYear = startDate.getYear();
		var endYear = endDate.getYear();
		var i = startYear;
		for (; i <= endYear; i++) {
			years.push(i);
		}
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
			var retval = {};
			retval.years = years;
			retval.sums = []
			for (let year of retval.years) {
				retval.sums.push(0);
			}
			for (let reservation of result) {
				var tempyear = reservation.startDate.getYear();
				var i = 0;
				for (; i < retval.years.length; i++) {
					if (tempyear == retval.years[i]) {
						retval.sums[i] += reservation.price;
						break;
					}
				}
			}
			var i = 0;
			for (; i < retval.years.length; i++) {
				retval.years[i] += 1900;
			}
			cb(null, retval);
		})
		.catch((err) => {
			cb(err, null);
		})
	}

	Carreservation.remoteMethod('getYearlyReport', {
		accepts: [{arg: 'startDate', type: 'date', required: true},
				  {arg: 'endDate', type: 'date', required: true},
				  {arg: 'rentalServiceId', type: 'string', required: true}],
		http: {path: '/getYearlyReport', verb: 'get'},
		returns: {type: 'object', arg: 'retval'}
	});
};
