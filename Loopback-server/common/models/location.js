/* eslint-disable indent */
'use strict';

module.exports = function(Location) {
  Location.observe('before save', function verifyPrimaryKey(ctx, next) {
    if (ctx.instance) {
      var s = ctx.instance;
      if (s.__data == {}) {
        next(new Error('No data sent'));
      } else {
        var country = s.__data.country;
        var city = s.__data.city;
        if (city == null || country == null) {
          next(new Error('No data sent'));
        } else {
          var countryPattern = new RegExp(country, 'i');
          var cityPattern = new RegExp(city, 'i');
          console.log(country);
          console.log(city);
          Location.find({where: {country: {like: countryPattern}, city: {like: cityPattern}}},
            (err, result) => {
              console.log(result);
              if (result.length > 0) {
                next(new Error('That location already exists'));
              } else {
                  next();
              }
            });
        }
      }
    } else {
        next(new Error('No data sent'));
    }
  });
};
