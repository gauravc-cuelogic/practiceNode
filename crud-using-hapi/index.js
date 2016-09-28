"use strict"

const Hapi = require('hapi');
const configs = require('./config/config.js');
const DB = require('./config/database-connection');
const Joi = require('joi');

const server = new Hapi.Server();

server.connection({host: configs.server.host, port: configs.server.port });

server.route({
    method: 'GET',
    path: '/getAllData',
    handler: function (request, reply) {
      var data = DB.findData("select * from users where is_deleted = ?",["0"], function(data){
          reply(data);
      });
    }
});

server.route({
    method: 'GET',
    path: '/fetchById/{id}',
    handler: function (request, reply) {
      console.log(request.params.id);
      var data = DB.findData("select * from users where is_deleted = 0 and id = ?",[request.params.id], function(data){
          reply(data);
      });
    }
});

server.route({
    method: 'DELETE',
    path: '/delete/{id}',
    handler: function (request, reply) {
      var data = DB.findData("Delete from users where id = ?",[request.params.id], function(data){
          reply(data);
      });
    }
});

server.route({
    method: 'POST',
    path: '/insert',
    handler: function (request, reply) {
      console.log(request.payload)
      var data = DB.findData("INSERT INTO `my_test_db`.`users` (`name`, `email`, `phone`, `address`) VALUES ( ?, ?, ?, ?);",
                            [request.payload.name,request.payload.email,request.payload.phone,request.payload.address],
                 function(data){
                      reply(data);
                  });
    },
    config: {
        validate: {
          payload: {
              name: Joi.string().required(),
              email: Joi.string().email(),
              phone: Joi.number(),
              address: Joi.string().max(255)
            }
        }
    }
});

server.route({
    method: 'PUT',
    path: '/update',
    handler: function (request, reply) {
      console.log(request.payload)
      var data = DB.findData("UPDATE `users` SET `name` = ?, `email` = ?, `phone` = ?, `address` = ? WHERE `id` = ?;",
                            [request.payload.name,request.payload.email,request.payload.phone,request.payload.address,request.payload.id],
                 function(data){
                      reply(data);
                  });
    },
    config: {
        validate: {
          payload: {
              id: Joi.number().required(),
              name: Joi.string().required(),
              email: Joi.string().email(),
              phone: Joi.number(),
              address: Joi.string().max(255)
            }
        }
    }
});

server.start(function(err){

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
