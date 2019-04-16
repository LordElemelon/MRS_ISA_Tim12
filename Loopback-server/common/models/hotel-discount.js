'use strict';

module.exports = function(Hoteldiscount) {
	Hoteldiscount.observe('before save', function verifyForeignKeys(ctx, next){
        if (ctx.instance){
            var s = ctx.instance;
            var hotelId = s.__data.hotelId;
			var roomId = s.__data.roomId
			var discount = s.__data.discount;
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
						else{
							return next();
						}
					});
                });
            });
        }
    });
};
