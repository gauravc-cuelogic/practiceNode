"use strict"

const Hapi = require('hapi');
const configs = require('./config/config.js');
const DB = require('./config/database-connection');
const Joi = require('joi');
const uuid = require('node-uuid');

const server = new Hapi.Server();

server.connection({host: configs.server.host, port: configs.server.port });

server.route({
    method: 'POST',
    path: '/login',
    handler: function (request, reply) {
      DB.connectDb();
      var data = DB.findData("select id from users where is_deleted = 0 and username = ? and password= ?",
                      [request.payload.username,request.payload.password], function(data){
            if(data.length > 0 && data[0].id){
              var loginKey = uuid.v1();
              DB.findData("UPDATE `users` SET `login_auth_key` = ? WHERE `id` = ?;",[loginKey, data[0].id],function(data){
                DB.endConnection();
                reply(loginKey);
              });
            }else{
              DB.endConnection();
              reply('No record Found');
            }
      });
    }
});

server.route({
    method: 'GET',
    path: '/task',
    handler: function (request, reply) {
      if(!request.headers.authorization){
        reply('User Not Logged In.Auth')
      }
      DB.connectDb(request.headers.authorization, function (success){
        if(!success){
          reply('Un Authorised Access!');
        }else{
          var data = DB.findData("select * from users where is_deleted = ?",["0"], function(data){
              DB.endConnection();
              reply(data);
          });
        }
      });

    }
});

server.route({
    method: 'GET',
    path: '/task/{id}',
    handler: function (request, reply) {
      if(!request.headers.authorization){
        reply('User Not Logged In.Auth')
      }
      DB.connectDb(request.headers.authorization, function (success){
        if(!success){
          reply('Un Authorised Access!');
        }else{
          var data = DB.findData("select * from users where is_deleted = 0 and id = ?",[request.params.id],
            function(data){
              DB.endConnection();
              reply(data);
          });
        }
      });

    }
});

server.route({
    method: 'DELETE',
    path: '/task/{id}',
    handler: function (request, reply) {
      if(!request.headers.authorization){
        reply('User Not Logged In.Auth')
      }
      DB.connectDb(request.headers.authorization, function (success){
        if(!success){
          reply('Un Authorised Access!');
        }else{
          var data = DB.findData("Delete from users where id = ?",[request.params.id], function(data){
              DB.endConnection();
              reply(data);
          });
        }
      });
    }
});

server.route({
    method: 'POST',
    path: '/task',
    handler: function (request, reply) {
      if(!request.headers.authorization){
        reply('User Not Logged In.Auth')
      }
      DB.connectDb(request.headers.authorization, function (success){
        if(!success){
          reply('Un Authorised Access!');
        }else{
          var data = DB.findData("INSERT INTO `my_test_db`.`users` (`name`, `username`, `password`, `email`, `phone`, `address`) VALUES ( ?, ?, ?, ?, ?, ?);",
                                [request.payload.name,request.payload.username,request.payload.password,request.payload.email,request.payload.phone,request.payload.address],
             function(data){
                DB.createFriends(data.insertId,request.payload.friends)
                DB.endConnection();
                reply(data);
              });
        }
      });
    },
    config: {
        validate: {
          payload: {
              name: Joi.string().required(),
              username: Joi.string().required(),
              password: Joi.string().required(),
              email: Joi.string().email(),
              phone: Joi.number(),
              address: Joi.string().max(255),
              friends: Joi.string()
            }
        }
    }
});

server.route({
    method: 'PUT',
    path: '/task/{id}',
    handler: function (request, reply) {
      if(!request.headers.authorization){
        reply('User Not Logged In.Auth')
      }
      DB.connectDb(request.headers.authorization, function (success){
        if(!success){
          reply('Un Authorised Access!');
        }else{
          var data = DB.findData("UPDATE `users` SET `name` = ?, `username` = ?, `password` = ?, `email` = ?,\
                  `phone` = ?, `address` = ? WHERE `id` = ?;",
                  [request.payload.name, request.payload.username, request.payload.password,
                  request.payload.email, request.payload.phone, request.payload.address, request.params.id],
                  function(data){
                    DB.createFriends(request.params.id, request.payload.friends)
                    DB.endConnection();
                    reply(data);
                  });
        }
      });
    },
    config: {
        validate: {
          payload: {
              name: Joi.string().required(),
              username: Joi.string().required(),
              password: Joi.string().required(),
              email: Joi.string().email(),
              phone: Joi.number(),
              address: Joi.string().max(255),
              friends: Joi.string()
            }
        }
    }
});

server.route({
    method: 'GET',
    path: '/friend/{id}/{name?}',
    handler: function (request, reply) {
      if(!request.headers.authorization){
        reply('User Not Logged In.Auth')
      }
      DB.connectDb(request.headers.authorization, function (success){
        if(!success){
          reply('Un Authorised Access!');
        }else{
          var name = request.params.name ? "users.name = '"+request.params.name+"'" : 'users.name IS Not Null';
          console.log(name)
          var data = DB.findData("SELECT users.name,users.email,users.phone,users.address \
                      FROM `friends` inner join users on(users.id = friends.friend_id) \
                      WHERE friends.user_id = ? and "+name,[request.params.id],
            function(data){
              DB.endConnection();
              reply(data);
          });
        }
      });

    }
});

server.route({
    method: 'DELETE',
    path: '/friend/{id}/{friendId}',
    handler: function (request, reply) {
      if(!request.headers.authorization){
        reply('User Not Logged In.Auth')
      }
      DB.connectDb(request.headers.authorization, function (success){
        if(!success){
          reply('Un Authorised Access!');
        }else{
          var data = DB.findData("Delete from friends where user_id = ? and friend_id = ?",
                      [request.params.id,request.params.friendId],
                      function(data){
                        DB.endConnection();
                        reply(data);
                      });
        }
      });
    }
});

server.start(function(err){

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
