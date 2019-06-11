/* eslint-disable max-len */
'use strict';

module.exports = function(Reservationoffer) {
  Reservationoffer.observe('after save', (ctx, next) => {
    setTimeout(() => {
      const instance = ctx.instance;
      let specialOfferPrice = 0;
      Reservationoffer.app.models.HotelSpecialOffer.findById(instance.specialOfferId)
        .then(result =>{
          specialOfferPrice = result.price;
          return Reservationoffer.app.models.RoomReservation.findOne({where: {id: instance.roomReservationId}});
        })
        .then(reservation => {
          return reservation.updateAttribute('price', reservation.price + specialOfferPrice);
        })
        .then(result => {
          next();
        })
        .catch(err => next(err));
    }, 500);
  });
};
