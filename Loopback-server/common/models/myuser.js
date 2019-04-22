'use strict';

var config = require('../../server/config.json');
var path = require('path');

module.exports = function(Myuser) {
	
	Myuser.afterRemote('create', function(context, userInstance, next) {
		console.log("After triggered");
		
		var verifyOptions = {
			type: 'email',
			to: userInstance.email,
			from: 'DasTravelSite@gmail.com',
			subject: 'Thanks for registering',
			template: path.resolve(__dirname, '../../server/views/verify.ejs'),
			redirect: 'http://localhost:4200',
			user: userInstance
		};
		
		userInstance.verify(verifyOptions, function(err, response) {
			if (err) return next(err);
			
			console.log('verification email sent');
			
			next();
		});
	});
	
};
