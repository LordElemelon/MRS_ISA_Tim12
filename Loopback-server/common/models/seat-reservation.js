'use strict';

module.exports = function(Seatreservation) {

  Seatreservation.observe('after save',
    function(ctx, next) {
			if (ctx.instance) {
				var data = ctx.instance.__data;
				
				var Flight = Seatreservation.app.models.Flight;
				var Seat = Seatreservation.app.models.Seat;
				var Myuser = Seatreservation.app.models.Myuser;
				
				console.log("are we here yet");
				
				Seat.findOne({where: {id: data.seatId}}).then(
					seat => {
						Flight.findOne({where: {id: seat.flightId}}).then(
							flight => {
								Myuser.findOne({where: {id: data.myuserId}}).then(
									user => {
										var flightString = flight.origin + "-" + flight.destination + " on " + 
																	flight.takeoffDate.toLocaleDateString() + ", taking off at " + flight.takeoffDate.toLocaleTimeString();
										var seatString = seat.row + '/' + seat.column;
										Seatreservation.app.models.Email.send({
											to: user.email,
											from: 'DasTravelSite@gmail.com',
											subject: 'Reservation',
											text: 'Test',
											html: '<h1>A ticket for flight '+ flightString + ', with seat number ' + seatString + ' has been reserved.</h1>'
										},function(err,res){
											console.log('email sent!');
											next(err);
										});
									},
									err => {
										next(err);
									}
								); 
							},
							err => {
								next(err);
							}
						);
					},
					err => {
						next(err);
					}
				);
			}
	  
    });
  
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
