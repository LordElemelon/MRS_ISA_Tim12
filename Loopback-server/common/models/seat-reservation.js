'use strict';

module.exports = function(Seatreservation) {
  Seatreservation.makeReservation = function(seatId, userId, price, cb) {
		Seatreservation.beginTransaction({isolationLevel: Seatreservation.Transaction.READ_COMMITED}, function(err, tx) {
			const postgres = Seatreservation.app.dataSources.postgres;
			postgres.connector.execute("SELECT seatid FROM seatid WHERE seatid = '" + seatId + "' FOR UPDATE;", null, (err, result) => {
				if (err) {
					tx.rollback();
					cb(err, null);
				}	else {
					Seatreservation.app.models.SeatId.find({where: {seatId: seatId}}, {transaction: tx}, (err, res) => {
						if (err) {
							tx.rollback();
							cb(err, null);
						}
						else {
							Seatreservation.find({where: {seatId: seatId}},
                {transaction: tx},
                (err, res) => {
									if (err) {
										tx.rollback();
										cb(err, null);
									}
									else {
										if (res.length > 0) {
											tx.rollback();
											cb(new Error('Can not reserve this seat'), null);
										} else {
                      Seatreservation.create({price: price, myuserId: userId, seatId: seatId}, 
                      {transaction: tx},
											(err, res) => {
												if (err) {
                          tx.rollback();
                          console.log(cb);
													cb(err, null);
												} else {
													tx.commit();
													cb(null, res);
												}
											});
										}
									}
								});
							console.log("usao");
							// setTimeout(() => {console.log('izas'); tx.commit();cb(null, res);}, 5000);
						}
					});
				}
			});
		});
	};

	Seatreservation.remoteMethod('makeReservation', {
        accepts: [{arg: 'seatId', type: 'string', required: true},
				  {arg: 'userId', type: 'string', required: true},
				  {arg: 'price', type: 'number', required: true}],
        http: {path: '/makeReservation', verb: 'post'},
        returns: {type: 'object', arg: 'retval'}
  });
};
