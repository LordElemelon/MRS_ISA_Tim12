'use strict';

module.exports = function(Discountoffer) {
	Discountoffer.observe('before save', function verifyForeignKeys(ctx, next){
        if (ctx.instance){
            var s = ctx.instance;
            var hotelDiscountId = s.__data.hotelDiscountId;
			var hotelSpecialOfferId = s.__data.hotelSpecialOfferId
            Discountoffer.getApp((err, app) =>{
                app.models.HotelDiscount.exists(hotelDiscountId, (err, exists) =>{
                    if (err) next(err);
                    if (!exists)
                        return next(new Error('Bad foreign key for discount: ' + hotelDiscountId));
					app.models.HotelSpecialOffer.exists(hotelSpecialOfferId, (err, exists) =>{
						if (err) next(err);
						if (!exists)
							return next(new Error('Bad foreign key for special offer: ' + hotelSpecialOfferId));
						return next();
					});
                });
            });
        }
    });
};
