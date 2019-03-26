const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');

const hotelRouter = require('./routes/hotelRouter.js');
const sysAdminRouter = require('./routes/sysAdminRouter.js');

const hostname = 'localhost';
const port = 3000;

const rentalRouter = require('./routes/carRentalServiceRouter');

const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
<<<<<<< HEAD
app.use('/rentalServices', rentalRouter);
=======
app.use('/hotels', hotelRouter);
app.use('/sysAdmin', sysAdminRouter);
>>>>>>> 5f976f604c37553070425c02d723136b040dcd85

app.use((req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end('<html><body><h1>This is an Express Server</h1></body></html>');

});

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
