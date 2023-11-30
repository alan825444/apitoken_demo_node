const { escape } = require("mysql");
const mysql = require('mysql');
const config = require('../../config');
const connect = mysql.createConnection(config.dbdata);
const jwt = require('jsonwebtoken');


exports.teset = function () {
    console.log('test');
}

exports.test2 = function () {
    console.log('test2')
}

findUser = function (req, res) {
    const account = escape(req.body.Accout);
    const password = escape(req.body.Password);
    const connect = mysql.createConnection(config.dbdata);
    let sqlStr = `SELECT * FROM demodb.tmember WHERE Account = 'admin' AND Password = '1234'`;
    connect.query(sqlStr, function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
            return results;
        } else {
            return null;
        }
    });
}

exports.autenticate = function (req, res) {
    const account = escape(req.body.Accout);
    const password = escape(req.body.Password);
    const connect = mysql.createConnection(config.dbdata);
    let sqlStr = `SELECT * FROM demodb.tmember WHERE Account = ${account} AND Password = ${password}`;
    connect.query(sqlStr, function (error, results, fields) {
        if (error) throw error;
        if (results.length == 0) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (results.length > 0) {
            const test = {
                name: results[0].Name,
                password: results[0].Password,
                admin: results[0].admin === 'Y' ? true : false
            }
            const token = jwt.sign(test, config.secret, {
                expiresIn: 60 * 60 *24
            });

            res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token
            });
        }
    });
}

