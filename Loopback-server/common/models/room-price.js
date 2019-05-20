'use strict';

module.exports = function(Roomprice) {
  Roomprice.observe('before save', function verifyForeignKeys(ctx, next){
    if (ctx.instance) {
      var s = ctx.instance;
      console.log(s.__data.startDate);
      var hotelId = s.__data.hotelId;
      var roomId = s.__data.roomId;
      var price = s.__data.price;
      if (isNaN(price))
        return next(new Error('Price has to be a number'));
      if (price <= 0)
        return next(new Error('Price has to be higher than 0'));
      Roomprice.getApp((err, app) =>{
        app.models.Hotel.exists(hotelId, (err, exists) =>{
          if (err) next(err);
          if (!exists)
            return next(new Error('Bad foreign key for hotel: ' + hotelId));
          app.models.Room.exists(roomId, (err, exists) =>{
            if (err) next(err);
            if (!exists)
              return next(new Error('Bad foreign key for room: ' + roomId));
            else {
              return next();
            }
          });
        });
      });
    }
  });
};
