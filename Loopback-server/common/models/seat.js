'use strict';

module.exports = function(Seat) {
  Seat.observe('before save', function verifyForeignKeys(ctx, next) {
    if (ctx.instance) {
      var s = ctx.instance;
      if (s.__data == {}) {
        let error = new Error('No data sent');
        error.status = 500;
        next(error);
      } else {
        var flightId = s.__data.flightId;
        if (flightId === null || flightId === undefined) {
          var error = new Error('flight id not sent');
          error.status = 500;
          next(error);
        } else {
          Seat.getApp((err, app) => {
            app.models.Flight.exists(flightId, (err, exists) => {
              if (err) next(err);
              if (!exists) {
                return next(new Error('Bad foreign key for flight: ' + flightId));
              } else {
                return next();
              }
            });
          });
        }
      }
    }
  });
  Seat.observe('after save', function saveInPostgre(ctx, next) {
    Seat.app.models.SeatId.create({'seatId': ctx.instance.id}, (err, result) => {
      if (err) next(err);
      else next();
    });
  });

};
