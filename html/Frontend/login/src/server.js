const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'build')));

//initialize the database controllers
const users = require("./model/userController")

//routes

app.post('/backend/login', function (req, res) {
  res.send('Login Recieved!');
  console.log(req);
});

app.post('/backend/signup', users.signup );

app.listen(process.env.PORT || 8080);