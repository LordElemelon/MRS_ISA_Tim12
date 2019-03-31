const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const hotelRouter = require('./routes/hotelRouter.js');
const sysAdminRouter = require('./routes/sysAdminRouter.js');
const rentalRouter = require('./routes/carRentalServiceRouter');

const hostname = 'localhost';
const port = 3000;

const url = 'mongodb://localhost:27017/travels';
const connect = mongoose.connect(url);

connect.then((db) => {
    console.log("Connected to the database correctly");
}, (err) => { console.log(err); });

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/rentalServices', rentalRouter);
app.use('/hotels', hotelRouter);
app.use('/sysAdmin', sysAdminRouter);


app.use((req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<html><body><h1>This is an Express Server</h1></body></html>');

});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
