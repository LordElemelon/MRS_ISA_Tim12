const express = require('express');
const bodyParser = require('body-parser');
const Hotels = require('../models/hotel/hotel.js');

const hotelRouter = express.Router();
hotelRouter.use(bodyParser.json());

hotelRouter.route('/')
    .put((req,res) => {
        if (req.body.year > 2019){
            res.send("<html><body>fail, it couldn't have been established after 2019</body><html>");
            return;
        }
        //modifying the hotel
        Hotels.findOneAndUpdate({"name" : "hotel1"}, {
            $set: {"name" : req.body.name, "address" : req.body.address, "description" : req.body.description}
        }, {new : true})
            .then((hotel) => {
                res.send(hotel);
            })
            .catch((err) => {
                res.send({err});
            });
    });

hotelRouter.route('/room')
    .post((req, res, next)=>{
        Hotels.findOne({"name" : "hotel1"}) //dodati sobu u hotel. Kako??
            .then((hotel)=>{
                if (hotel != null){
                    room = findRoom(hotel, req.body.number);
                    if (room == null){
                        hotel.rooms.push(req.body);
                        hotel.save()
                            .then((hotel) => {
                                res.send(hotel.rooms);
                                return;
                            }, (err) => next(err));
                    }else{
                        res.send({"cod": 402, "message": "room number taken"});
                        err = new Error('Room ' + req.body.number + ' already taken');
                        return next(err);
                    }
                }else{
                    return next(new Error('Hotel not found'));
                }
            }, (err) => next(err))
            .catch((err) =>{
                console.log(err);
            });
    });
hotelRouter.route('/room/:roomid')
    .get((req,res) =>{
        Hotels.findOne({"name" : "hotel1"})
            .then((hotel)=>{
                if (hotel != null){
                    retVal = findRoom(hotel, req.params.roomid);
                    res.send(retVal);
                    return;
                }
            })
            .catch((err)=>{
                cosole.log(err);
            });
    })
    .put((req, res, next)=>{
        Hotels.findOne({"name" : "hotel1"})
            .then((hotel)=>{
                if (hotel != null){
                    room = findRoom(hotel, req.params.roomid);
                    if (room != null){
                        if (req.body.description != null)
                            room.description = req.body.description;
                        if (req.body.beds != null)
                            room.beds = parseInt(req.body.beds);
                        hotel.save()
                            .then((hotel) =>{
                                res.send(hotel.rooms);
                                return;
                            }, (err) => next(err));
                    }else{
                        res.send({"cod": 402, "message": "room doesn't exist"});
                        return next(new Error('Room ' + req.params.roomid + " doesn't exist"));
                    }
                }else{
                    return next(new Error('Hotel not found'));
                }
            })
            .catch((err)=>{
                console.log(err);
            });
    })
    .delete((req, res, next)=>{
        Hotels.findOne({"name" : "hotel1"})
            .then((hotel)=>{
                if (hotel != null){
                    room = findRoom(hotel, req.params.roomid);
                    if (room != null){
                        room.active = false;
                        hotel.save()
                            .then((hotel) =>{
                                res.send(hotel.rooms);
                                return;
                            }, (err) => next(err));
                    }else{
                        res.send({"cod": 402, "message": "room doesn't exist"});
                        return next(new Error('Room ' + req.params.roomid + " doesn't exist"));
                    }
                }else{
                    return next(new Error('Hotel not found'));
                }
            })
            .catch((err)=>{
                console.log(err);
            });
    });

function findRoom(hotel, number){
    console.log(hotel);
    console.log(hotel.name);
    console.log(hotel.rooms);
    for (room of hotel.rooms){
        if (room.number == number){
            return room;
        }
    }
    return null;
}
module.exports = hotelRouter;
