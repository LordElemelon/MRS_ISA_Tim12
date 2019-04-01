const express = require('express');
const bodyParser = require('body-parser');

const airlineRouter = express.Router();

var dummyAirline = {
    name: "Some airline",
    address: "On some address",
    description: "With some description"
}

airlineRouter.route('/modifyAirline')
.all((req, res, next) =>  {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Get for modifying airline not implemented yet');
})
.post((req, res, next) => {
    res.end('Post for modifying airline not implemented yet');
})
.delete((req, res, next) => {
    res.end('Delete for modifying airline not implemented yet');
})
.put((req, res, next) => {
    //this rest call only changes primitive attributes (name, address, description)
    res.setHeader('Content-Type', 'application/json');
    var airlineList = [dummyAirline];
    var matchingService = null
    for (airline of airlineList) {
        if (airline.name == req.body.name) {
            matchingService = airline;
            break;
        }
    }
    if (matchingService == null) {
        res.json(null);
        res.end();
    } else {
        if (req.body.address == "" || req.body.description == "") {
            res.json(null);
            res.end();
            return;
        }
        matchingService.address = req.body.address;
        matchingService.description = req.body.description;
        res.json(matchingService);
        res.end();
    }    
});

module.exports = airlineRouter;