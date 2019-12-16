var express = require('express');
var path =require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var connectionDB = require('./models/connection_schema');
var userDB = require('./models/user_schema');
var userschemaDB = require('./models/user_connections_schema');
const {expressValidator} = require('express-validator');
var bodyParser = require('body-parser')

console.log(expressValidator);
var mongoose = require('mongoose');
// var connectionDB = require('../models/connection_schema');

var db = 'mongodb://localhost:27018/application';
mongoose.connect(db);
console.log(userschemaDB);
var app = express();

app.use(bodyParser.urlencoded({ extended: false }))

let ProfileController = require('./routes/profile_Controller');
let Controller = require('./routes/controller');

// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(cookieParser());

app.use(session({secret:'sb', resave: false, saveUninitialized: false})); //Initialize session
app.use('*/assets',express.static(path.join(__dirname, 'assets')));

app.use('/', Controller);
app.use('/',ProfileController);
// app.use('/newConnection',Controller);
// app.use('/connections',Controller);
// app.use('/:connection_ID', Controller);
// app.use('/savedconnections',Controller);
// app.use('/about',Controller);
// app.use('/contact',Controller);
// app.use('/logout',Controller);


module.exports = app;

app.listen(3000, () => console.log(`Example app listening on port 3000!`))

// [ userConnection {
//     connection:
//      connection {
//        _connection_ID: 'CCI_6',
//        _connection_name: 'Cricket Tournament',
//        _connection_topic: 'Sports',
//        _details: 'Learning Cricket and it\'s minute technicalities',
//        _date: 'Friday,20 Dec 2019',
//        _location: 'Portal 1st Floor',
//        _time: '4pm-6pm',
//        _hosted_by: 'Jenny Sanders',
//        _rsvp: 'No' },
//     rsvp: 'No' },
//   userConnection {
//     connection:
//      connection {
//        _connection_ID: 'CCI_2',
//        _connection_name: 'ITCS 6156 Machine Learning',
//        _connection_topic: 'Study',
//        _details: 'Lets chat on Classification Techniques',
//        _date: 'Tuesday, Sept 27 2019',
//        _location: 'Woodward Hall 1st Floor',
//        _time: '5:30pm - 6:30 pm',
//        _hosted_by: 'Dr John Guttag',
//        _rsvp: 'No' },
//     rsvp: 'No' },
//   userConnection {
//     connection:
//      connection {
//        _connection_ID: 'CCI_4',
//        _connection_name: 'Football Anyone',
//        _connection_topic: 'Sports',
//        _details: 'Football Tournament intercollegiate through North Carolina',
//        _date: 'Wednesday,26 Oct,2019',
//        _location: 'Duke 2nd Floor',
//        _time: '9am - 10am',
//        _hosted_by: 'Gary',
//        _rsvp: 'No' },
//     rsvp: 'No' } ]