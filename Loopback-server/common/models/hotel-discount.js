'use strict';

module.exports = function(Hoteldiscount) {
  Hoteldiscount.observe('before save', function verifyForeignKeys(ctx, next) {
    if (ctx.instance) {
      var s = ctx.instance;
      var hotelId = s.__data.hotelId;
      var roomId = s.__data.roomId;
      var discount = s.__data.discount;
      var startDate = s.__data.startDate;
      var endDate = s.__data.endDate;
      if (isNaN(discount))
        return next(new Error('Discount has to be a number'));
      if (discount <= 0 || discount > 100)
        return next(new Error('Discount has to be higher than 0 and lower than 101'));
      Hoteldiscount.getApp((err, app) =>{
        app.models.Hotel.exists(hotelId, (err, exists) =>{
          if (err) next(err);
          if (!exists)
            return next(new Error('Bad foreign key for hotel: ' + hotelId));
          app.models.Room.exists(roomId, (err, exists) =>{
            if (err) next(err);
            if (!exists)
              return next(new Error('Bad foreign key for room: ' + roomId));
            else {
              Hoteldiscount.getApp((err, app) => {
                if (err) return next(err);
                else {
                  app.models.RoomPrice.findOne({
                    where: {startDate: {lte: startDate}, roomId: roomId},
                    order: 'startDate DESC',
                  })
                    .then(roomPrice => {
                      if (!roomPrice) next(new Error('There is no price for this room for this time'));
                      else {
                        return next();
                      }

                      return next();
                    });
                }
              });
            }
          });
        });
      });
    }
  });

  Hoteldiscount.observe('after save', function addReservation(ctx, next) {
    Hoteldiscount.getApp((err, app) => {
      if (err) next(err);
      else {
        app.models.RoomPrice.findOne({
          where: {startDate: {lte: ctx.instance.startDate}, roomId: ctx.instance.roomId},
          order: 'startDate DESC',
        })
          .then(roomPrice => {
            let newPrice = roomPrice.price;
            newPrice -= Math.ceil(newPrice * ctx.instance.discount / 100);
            return app.models.RoomReservation.makeReservation(ctx.instance.startDate, ctx.instance.endDate,
              ctx.instance.roomId, null, newPrice, ctx.instance.id, ctx.instance.hotelId, false,
              (err, res) => {
                if (err) {
                  Hoteldiscount.destroyById(ctx.instance.id);
                  next(err);
                } else {
                  ctx.instance.reservationId = res.id;
                  Hoteldiscount.updateAll({id: ctx.instance.id}, {reservationId: ctx.instance.id}, null);
                  next();
                }
              });
          });
      }
    });
  });
};
