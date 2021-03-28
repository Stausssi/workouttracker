const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'build')));

//initialize the database controller

//routes

app.post('/backend/login', function (req, res) {
  res.send('Login Recieved!');
  console.log(req);
});

app.listen(process.env.PORT || 8080
  );