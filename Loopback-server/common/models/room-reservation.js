/* eslint-disable indent */
/* eslint-disable max-len */
'use strict';

module.exports = function(Roomreservation) {
	Roomreservation.makeReservation = function(startDate, endDate, roomId, userId, price, cb) {
		Roomreservation.beginTransaction({isolationLevel: Roomreservation.Transaction.READ_COMMITED}, function(err, tx) {
			const postgres = Roomreservation.app.dataSources.postgres;
			postgres.connector.execute("SELECT roomid FROM roomid WHERE roomid = '\"" + roomId + "\"' FOR UPDATE;", null, (err, result) => {
				if (err) {
					tx.rollback();
					cb(err, null);
				}
				else {
					Roomreservation.app.models.Roomid.find({where: {roomId: '\"' + roomId + '\"'}}, {transaction: tx}, (err, res) => {
						if (err) {
							tx.rollback();
							cb(err, null);
						}
						else {
							Roomreservation.find({
								where: {
									roomId: '\"' + roomId + '\"',
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
									else {
										console.log(res);
										if (res.length > 0) {
											tx.rollback();
											cb(new Error('Can not reserve on this date'), null);
										} else {
											Roomreservation.create({startDate: startDate, endDate: endDate,
												price: price, myuserId: userId, roomId: roomId}, {transaction: tx},
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
	}
	
	Roomreservation.remoteMethod('makeReservation', {
        accepts: [{arg: 'startDate', type: 'date', required: true},
				  {arg: 'endDate', type: 'date', required: true},
				  {arg: 'roomId', type: 'string', required: true},
				  {arg: 'userId', type: 'string', required: true},
				  {arg: 'price', type: 'number', required: true}],
        http: {path: '/makeReservation', verb: 'post'},
        returns: {type: 'object', arg: 'retval'}
    });
};
