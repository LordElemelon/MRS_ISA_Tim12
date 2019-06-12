/* eslint-disable indent */
'use strict';

module.exports = function(Hotel) {
    Hotel.observe('before save', function findLatLong(ctx, next) {
      let instance = ctx.instance.__data;
      let address = instance.address;
      let queryString = address;
      let locationId = instance.locationId;

      if (locationId != null && locationId != undefined) {
        Hotel.app.models.Location.findById(locationId, (err, result) => {
          if (err) next(new Error('Something went wrong'));
          else {
            if (result != null) {
              // eslint-disable-next-line max-len
              queryString = result.country + ' ' + result.city + ' ' + address;
            }
              var geoService = Hotel.app.dataSources.geoRest;
              geoService.geocode(queryString, (err, result) => {
                if (err) next(new Error('Something went wrong'));
                else if (result.length > 0) {
                  instance.latitude = result[0].lat;
                  instance.longitude = result[0].lng;
                  next();
                } else {
                  instance.latitude = 0;
                  instance.longitude = 0;
                  next();
                }
              });
          }
        });
      } else {
        next();
      }
    });
};
