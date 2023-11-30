const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mysql = require('mysql');
const common = require('./app/models/common');


const jwt = require('jsonwebtoken');
const config = require ('./config');
const User = require('./app/models/user');

const port = process.env.PORT || 8080;
const connection = mysql.createConnection(
    config.dbdata
)

connection.connect();
app.set('secret', config.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/', function (req , res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
})

app.get('/setup', function (req, res) {
    common.teset();
});

app.listen(port, function () {
    console.log('The server is running at http://localhost:' + port)
  })

var api = express.Router();

// api.get('/test', function (req, res) {
//     common.findUser(req, res)
// });

api.get('/authenticate', function (req, res) {
    common.autenticate(req, res)
});

api.use(function (req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, app.get('secret'), function (err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                console.log(decoded)
                req.decoded = decoded;
                next()
            }
        });
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        })
    }
});

api.get('/', function (req, res) {
    res.json({ message: 'Welcome to the API' });
});

api.get('/users', function (req, res) {
    connection.query('SELECT * FROM tmember', function (error, results, fields) {
        if (error) throw error;
        res.json(results);
    });
});

app.use('/api', api);