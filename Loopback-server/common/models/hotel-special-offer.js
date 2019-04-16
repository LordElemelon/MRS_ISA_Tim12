'use strict';

module.exports = function(Hotelspecialoffer) {
    Hotelspecialoffer.observe('before save', function verifyForeignKeys(ctx, next){
		if (ctx.instance){
			var s = ctx.instance;
			var hotelId = s.__data.hotelId;
			var price = s.__data.price;
			if (isNaN(price))
				return next(new Error('Price has to be a number'));
			if (price <= 0)
				return next(new Error('Price has to be higher than 0'));
			if (hotelId === null || hotelId === undefined){
				next();
			}
			Hotelspecialoffer.getApp((err, app) =>{
				app.models.Hotel.exists(hotelId, (err, exists) =>{
					if (err) next(err);
					if (!exists){
						return next(new Error('Bad foreign key for hotel: ' + hotelId));
					}
					else{
						return next();
					}
				});
			});
		};
	});
};
