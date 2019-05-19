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
	
	Carreservation.cancel = function(id, options, cb) {
		if (options.accessToken == null) {
			cb(new Error("No user logged in"),null);
			return;
		}
		console.log(id);
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
			return Carreservation.destroyById(id);
		})
		.then((result) => {
			cb(null, true);
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
	
};
