'use strict';

module.exports = function (Room) {
  Room.observe('before save', function verifyForeignKeys(ctx, next) {
    if (ctx.instance) {
      var s = ctx.instance;
      if (s.__data == {}) {
        let error = new Error('No data sent');
        error.status = 500;
        next(error);
      } else {
        var hotelId = s.__data.hotelId;
        if (hotelId === null || hotelId === undefined) {
          var error = new Error('hotel id not sent');
          error.status = 500;
          next(error);
        } else {
          Room.getApp((err, app) => {
            app.models.Hotel.exists(hotelId, (err, exists) => {
              if (err) next(err);
              if (!exists) {
                return next(new Error('Bad foreign key for hotel: ' + hotelId));
              } else {
                return next();
              }
            });
          });
        }
      }
    }
  });
};

