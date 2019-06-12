'use strict';

module.exports = function(Branch) {
    Branch.observe('before save', function verifyForeignKeys(ctx, next){
        if (ctx.instance){
            var s = ctx.instance;
            var rentalServiceId = s.__data.rentalServiceId;
            Branch.getApp((err, app) =>{
                app.models.RentalService.exists(rentalServiceId, (err, exists) =>{
                    if (err) { next(err); return; }
                    if (!exists)
                        return next(new Error('Bad foreign key: ' + rentalServiceId));
                    let instance = ctx.instance.__data;
                    let address = instance.address;
                    let queryString = address;
                    app.models.RentalService.findById(rentalServiceId, (err, result) => {
                        if (err) { next(err); return; }
                        let locationId = result.locationId;
						if (locationId != undefined && locationId != '') {
							Branch.app.models.Location.findById(locationId, (err, result) => {
								if (err) { next(new Error('Something went wrong')); return; }
								if (result != null) {
									queryString = result.country + ' ' + result.city + ' ' + address;
								}
								var geoService = Branch.app.dataSources.geoRest;
								geoService.geocode(queryString, (err, result) => {
									if (err) { next(new Error('Something went wrong')); return }
									else if (result.length > 0) {
										instance.latitude = result[0].lat;
										instance.longitude = result[0].lng;
										next();
									} else {
										next();
									}
								});
							});
						} else {
						  next();	
						}
                    });
                })
            })
        }
    })
};
