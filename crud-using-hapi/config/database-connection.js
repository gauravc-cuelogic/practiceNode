"use strict"

const configs      = require('./config.js');
const mysql      = require('mysql');


var findData = function (sql, values, cb){
  const connection = mysql.createConnection({
    host     : configs.database.host,
    user     : configs.database.username,
    password : configs.database.password,
    database : configs.database.db
  });

  connection.connect();

  connection.query({
      sql: sql,
      timeout: 40000,
      values: values,
      }, function(err, rows, fields) {
          if (err) throw err;
          cb && cb(rows);
    });

  connection.end();

}


module.exports = {
  findData: findData,
}
