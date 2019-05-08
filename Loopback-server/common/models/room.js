'use strict';

module.exports = function(Room) {
  Room.observe('before save', function verifyForeignKeys(ctx, next) {
    if (ctx.instance) {
      var s = ctx.instance;
      if (s.__data == {}) {
        let error = new Error('No data sent');
        error.status = 500;
        next(error);
      } else {
        var hotelId = s.__data.hotelId;
        if (hotelId === null || hotelId === undefined) {
          var error = new Error('hotel id not sent');
          error.status = 500;
          next(error);
        } else {
          Room.getApp((err, app) => {
            app.models.Hotel.exists(hotelId, (err, exists) => {
              if (err) next(err);
              if (!exists) {
                return next(new Error('Bad foreign key for hotel: ' + hotelId));
              } else {
                return next();
              }
            });
          });
        }
      }
    }
  });
  Room.observe('after save', function saveInPostgre(ctx, next) {
    Room.app.models.Roomid.create({'roomId': ctx.instance.id}, (err, result) => {
      if (err) next(err);
      else next();
    });
  });

  Room.findRooms = function(start, end, location, price, beds, cb) {
    if (!location) location = '';
    if (!price) price = Infinity;
    Room.getApp((err, app) => {
      if (err) cb(err, null);
      else {
        const Hotel = app.models.Hotel;
        Hotel.find({where: {address: {like: '.*' + location + '.*'}},
          include: 'rooms'})
          .then((hotels) => {
            let retval = [];
            var done = new Promise((resolve, reject) => {
              let indexHotels = 0;
              if (hotels.length === 0){
                resolve();
              }
              for (let hotel of hotels) {
                hotel.rooms.find({where: {beds: beds},
                  include: ['roomReservations', 'roomPrices']})
                  .then(rooms => {
                    var doneRooms = new Promise((resolve1, reject1) => {
                      if (rooms.length === 0)  {
                        resolve1();
                      }
                      let indexRooms = 0;
                      for (let room of rooms) {
                        room.roomPrices.findOne({
                          where: {startDate: {lt: start}},
                          order: 'startDate DESC',
                        })
                          .then(roomPrice => {
                            // check if the price exists and if it is lower than needed price
                            if (roomPrice && roomPrice.price < price) {
                              // check whether the room is already reserved
                              room.roomReservations.find({
                                where: {
                                  startDate: {lte: end},
                                  endDate: {gte: start},
                                },
                              })
                                .then((reservations) => {
                                  if (reservations.length === 0) {
                                    retval.push({'hotel': hotel.name,
                                      'room': {'number': room.number,
                                        'description': room.description,
                                        'beds': room.beds,
										'id': room.id},
                                      'price': roomPrice.price});
                                  }
                                  indexRooms++;
                                  if (indexRooms === rooms.length)  {
                                    resolve1();
                                  }
                                })
                                .catch(err => cb(err, null));
                            } else {
                              indexRooms++;
                              if (indexRooms === rooms.length)  {
                                resolve1();
                              }
                            }
                          })
                          .catch(err => cb(err, null));
                      }
                    });
                    doneRooms.then(() => {
                      indexHotels++;
                      if (indexHotels === hotels.length) {
                        resolve();
                      }
                    });
                  })
                  .catch(err => cb(err, null));
              }
            });
            done.then(() => {
              cb(null, retval);
            });
          })
          .catch((err) => cb(err, null));
      }
    });
  };

  Room.remoteMethod('findRooms', {
    accepts: [
      {arg: 'start', type: 'date', required: true},
      {arg: 'end', type: 'date', required: true},
      {arg: 'location', type: 'string', required: false},
      {arg: 'price', type: 'number', required: false},
      {arg: 'beds', type: 'number', required: true},
    ],
    http: {path: '/findRooms', verb: 'get'},
    returns: {type: 'object', arg: 'retval'},
  });
};

