'use strict';

module.exports = function(Room) {
    Room.observe('before save', function verifyForeignKeys(ctx, next){
		if (ctx.instance){
			var s = ctx.instance;
			var hotelId = s.__data.hotelId;
			if (hotelId === null || hotelId === undefined){
				next();
			}
			Room.getApp((err, app) =>{
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

