const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/API_Authentication');

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({ extended: true }));﻿

 // solving the CORS Error
app.use(function(req, res, next){
	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE");
	res.header('Access-Control-Allow-Headers', "Content-Type");
	next();

});

// Routes
app.use('/users', require('./routes/users'));


module.exports = app;