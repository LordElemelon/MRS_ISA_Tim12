'use strict'

module.exports = function (app) {
  var Myuser = app.models.Myuser;
  var Role = app.models.Role;
  Role.findOne({where: {name: 'admin'}}, (err, role, next) => {
    if (!role) {
      Role.create({
        name: 'admin',
      }, (err, role) => {
        if (err) next(err);
        else {
          insertAdmin(app, Myuser, Role);
        }
      });
    } else {
      insertAdmin(app, Myuser, Role);
    }
  });

  Role.findOne({where: {name: 'registeredUser'}}, (err, role, next) => {
    if (!role) {
      Role.create({
        name: 'registeredUser',
      }, (err, role) => {
        if (err) next(err);
      });
    }
  });

  Role.findOne({where: {name: 'airportAdmin'}}, (err, role, next) => {
    if (!role) {
      Role.create({
        name: 'airportAdmin',
      }, (err, role) => {
        if (err) next(err);
      });
    }
  });

  Role.findOne({where: {name: 'hotelAdmin'}}, (err, role, next) => {
    if (!role) {
      Role.create({
        name: 'hotelAdmin',
      }, (err, role) => {
        if (err) next(err);
      });
    }
  });

  Role.findOne({where: {name: 'rentalServiceAdmin'}}, (err, role, next) => {
    if (!role) {
      Role.create({
        name: 'rentalServiceAdmin',
      }, (err, role) => {
        if (err) next(err);
		else {
			//insertRentalAdmin(app, Myuser, Role);
		}
      });
    } else {
		//insertRentalAdmin(app, Myuser, Role);
	}
  });
};

function insertAdmin(app, Myuser, Role) {
  Myuser.findOne({where: {username: 'Admin'}}, (err, users, next) => {
    if (!users) {
      Myuser.create([
        {
          username: 'Admin', 'type': 'admin', email: 'dusanpanda@gmail.com',
          password: 'password', emailVerified: true,
        },
      ], (err, users) => {
        if (err) next(err);

        var RoleMapping = app.models.RoleMapping;

		RoleMapping.destroyAll();

				
        Role.findOne({where: {name: 'admin'}}, (err, role) => {
          if (!role) {
            Role.create({
              name: 'admin',
            }, (err, role) => {
              if (err) next(err);
              role.principals.create({
                principalType: RoleMapping.USER,
                principalId: users[0].id,
              }, (err, principal) => {
                if (err) next(err);
              });
            });
          } else {
            role.principals.create({
              principalType: RoleMapping.USER,
              principalId: users[0].id,
            }, (err, principal) => {
              if (err) next(err);
            });
          }
        });
      });
    }
  });
}
/*  za sada odustajem od ovog cuda, baguje
function insertRentalAdmin(app, Myuser, Role) {
	Myuser.findOne({where: {username: 'rentaladmin'}}, (err, users, next) => {
		if (!users) {
			Myuser.create([
				{
					username: 'rentaladmin', type: 'rentalServiceAdmin', email: 'zal@gmail.com',
					password: 'password', emailVerified: true,
				}	
			], (err, users) => { 
				if (err) next(err);
				Role.findOne({where: {name: 'rentalServiceAdmin'}}, 
					(err, role) => {
						if (!role) {
							Role.create({
							  name: 'rentalServiceAdmin',
							}, (err, role) => {
							  if (err) next(err);
							  role.principals.create({
							   principalType: RoleMapping.USER,
								principalId: users[0].id,
							  }, (err, principal) => {
								if (err) next(err);
							  });
							});
					   } else {
						   console.log("Kreiram svoju rollu");
						   role.principals.create({
							principalType: RoleMapping.USER,
							principalId: users[0].id,
						}, (err, principal) => {
							if (err) next(err);
						});
				    }
				});
			});
			
		}
	});
}
*/