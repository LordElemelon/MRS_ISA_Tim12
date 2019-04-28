'use strict';

module.exports = function(Carreservation) {
	Carreservation.makeReservation = function(startDate, endDate, carId, userId, price, cb) {
		Carreservation.beginTransaction({isolationLevel: Carreservation.Transaction.READ_COMMITED}, function(err, tx){
			const postgres = Carreservation.app.dataSources.postgres;
			postgres.connector.execute("SELECT carid FROM carid WHERE carid = '\"" + carId + "\"' FOR UPDATE;", null, (err, result) => {
				if (err) {
					tx.rollback();
					cb(err, null);
				}
				else{
					Carreservation.app.models.Carid.find({where: {carId: '\"' + carId + '\"'}}, {transaction: tx}, (err, res) => {
						if (err){
							tx.rollback();
							cb(err, null);
						}
						else{
							Carreservation.find({
								where: {
									carsId: '\"' + carId + '\"',
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
											Carreservation.create({startDate: startDate, endDate: endDate,
												price: price, myuserId: userId, carsId: carId}, {transaction: tx},
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
				  {arg: 'price', type: 'number', required: true}],
        http: {path: '/makeReservation', verb: 'post' },
        returns: {type: 'object', arg: 'retval'}
    })
};
