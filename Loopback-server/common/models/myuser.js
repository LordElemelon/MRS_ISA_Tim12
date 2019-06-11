'use strict';

var config = require('../../server/config.json');
var path = require('path');

module.exports = function (Myuser) {
  Myuser.afterRemote('create', function (context, userInstance, next) {
    var verifyOptions = {
      type: 'email',
      to: userInstance.email,
      from: 'DasTravelSite@gmail.com',
      subject: 'Thanks for registering',
      template: path.resolve(__dirname, '../../server/views/verify.ejs'),
      redirect: 'http://localhost:4200',
      user: userInstance,
    };

    userInstance.verify(verifyOptions, function(err, response) {
      if (err) return next(err);
      else {
        Myuser.getApp((err, app) => {
          if (err) return next(err);
          else {
            var Role = app.models.Role;
            var RoleMapping = app.models.RoleMapping;
            Role.findOne({where: {name: userInstance.type}},
              (err, role) => {
                if (err) return next(err);
                else {
                  if (role) {
                    role.principals.create({
                      principalType: RoleMapping.USER,
                      principalId: userInstance.id,
                    }, (err, principal) => {
                      if (err) return next(err);
                      else {
                        next();
                      }
                    });
                  } else {
                    let err = new Error('Role ' + userInstance.type +
                      ' does not exist');
                    err.code = 400;
                    next(err);
                  }
                }
              });
          }
        });
      }
    });
  });

  Myuser.beforeRemote('create', function(ctx, userInstance, next) {
    if (ctx.args.data) {
      var s = ctx.args.data;
      if (!s) {
        let error = new Error('No data sent');
        error.status = 500;
        next(error);
      } else {
        if (s['username'] !== 'Admin')
          s['type'] = 'registeredUser';
      }
    }
    next();
  });

  Myuser.registerAnAdmin = function(username, password, type, email, realm, emailVerified, cb) {
    const user = {username: username, password: password,
      type: type, email: email, realm: realm, emailVerified: emailVerified,
      passwordChanged: false};
    Myuser.create(user)
      .then((result, err) =>{
        if (err) return cb(err, null)
        else {
          let retval = result;
          Myuser.getApp((err, app) => {
            if (err) return cb(err, null);
            else {
              var Role = app.models.Role;
              var RoleMapping = app.models.RoleMapping;
              Role.findOne({where: {name: user.type}},
              (err, role) => {
                if (err) return cb(err, null);
                else {
                  if (role) {
                    role.principals.create({
                      principalType: RoleMapping.USER,
                      principalId: result.id,
                    }, (err, principal) => {
                      if (err) return cb(err, null);
                      else {
                        cb(null, result);
                      }
                    });
                  } else {
                    let err = new Error('Role ' + user.type +
                      ' does not exist');
                    err.code = 400;
                    cb(err, null);
                  }
                }
              });
            }
          });
        }
      }, err => cb(err, null));
  };

  Myuser.remoteMethod('registerAnAdmin', {
    accepts: [{arg: 'username', type: 'string', required: true},
      {arg: 'password', type: 'string', required: true},
      {arg: 'type', type: 'string', required: true},
      {arg: 'email', type: 'string', required: true},
      {arg: 'realm', type: 'string'},
      {arg: 'emailVerified', type: 'boolean', required: true}],
    http: {path: '/registerAnAdmin', verb: 'post'},
    returns: {type: 'object', arg: 'retval'},
  });

  Myuser.getRoomReservations = function(userId, size, offset, cb) {
    Myuser.getApp((err, app) => {
      if (err) cb(err, null);
      else {
        app.models.RoomReservation.find(
          {'where': {'myuserId': userId},
            'limit': size, 'skip': offset})
          .then(reservations => {
            console.log(reservations);
            cb(null, reservations);
          }, err => cb(err, null));
      }
    });
  };

  Myuser.remoteMethod('getRoomReservations', {
    accepts: [{arg: 'userId', type: 'string', required: true},
      {arg: 'size', type: 'number', required: true},
      {arg: 'offset', type: 'number', required: true}],
    http: {path: '/getRoomReservations', verb: 'get'},
    returns: {type: 'array', arg: 'retval'},
  });

  Myuser.getCarReservations = function(userId, size, offset, cb) {
    Myuser.getApp((err, app) => {
      if (err) cb(err, null);
      else {
        app.models.CarReservation.find(
          {'where': {'myuserId': userId },
            'limit': size, 'skip': offset})
          .then(reservations => {
            cb(null, reservations);
          }, err => cb(err, null));
      }
    });
  };

  Myuser.remoteMethod('getCarReservations', {
    accepts: [{arg: 'userId', type: 'string', required: true},
      {arg: 'size', type: 'number', required: true},
      {arg: 'offset', type: 'number', required: true}],
    http: {path: '/getCarReservations', verb: 'get'},
    returns: {type: 'array', arg: 'retval'},
  });
};
