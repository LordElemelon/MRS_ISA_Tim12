const express = require('express');
const bodyParser = require('body-parser');

const registeredUserRouter = express.Router();

var dummyUser = {
    email: "datboi@meme.lol",
    password: "oshitwaddup",
    firstName: "Dat",
    lastName: "Boi"
}

registeredUserRouter.route('/modifyUserData')
.all((req, res, next) =>  {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Get for modifying registered user not implemented yet');
})
.post((req, res, next) => {
    res.end('Post for modifying registered user not implemented yet');
})
.delete((req, res, next) => {
    res.end('Delete for modifying registered user not implemented yet');
})
.put((req, res, next) => {
    //this rest call only changes primitive attributes (firstName, lastName)
    res.setHeader('Content-Type', 'application/json');
    var userList = [dummyUser];
    var matchingUser = null
    for (user of userList) {
        if (user.email == req.body.email && user.password == req.body.password) {
            matchingUser = user;
            break;
        }
    }
    if (matchingUser == null) {
        res.json(null);
        res.end();
    } else {
        if (req.body.firstName == "" || req.body.lastName == "") {
            res.json(null);
            res.end();
            return;
        }
        matchingUser.firstName = req.body.firstName;
        matchingUser.lastName = req.body.lastName;
        res.json(matchingUser);
        res.end();
    }    
});

module.exports = registeredUserRouter;