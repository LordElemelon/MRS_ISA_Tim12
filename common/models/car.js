'use strict';

module.exports = function(Car) {
    Car.observe('before save', function verifyForeignKeys(ctx, next){
        if (ctx.instance){
            var s = ctx.instance;
            var rentalServiceId = s.__data.rentalServiceId;
            Car.getApp((err, app) =>{
                app.models.RentalService.exists(rentalServiceId, (err, exists) =>{
                    if (err) next(err);
                    if (!exists)
                        return next(new Error('Bad foreign key: ' + rentalServiceId));
                    return next();
                })
            })
        }
    })
};
