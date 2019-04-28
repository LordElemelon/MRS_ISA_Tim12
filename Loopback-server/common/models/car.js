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
                });
            });
        }
    });
    Car.observe('after save', function saveInPostgre(ctx, next) {
        Car.app.models.Carid.create({'carId': ctx.instance.id}, (err, result) => {
            if (err) next(err);
            else next();
        });
    });
};
