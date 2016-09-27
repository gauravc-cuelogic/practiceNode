'use strict';
/*var myDetails = {
      name: 'Gaurav Chauriya',
      Education: 'M.C.A',
      HomeTown: 'Nagpur'
  };
*/
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
Mongoose.connect('mongodb://localhost/my_testdb');
var UserSchema = new Schema({
    name: { type: String, unique: true, required: true },
    education: { type: String, required: true },
    hometown: { type: String, required: true }
});
var User = Mongoose.model('user', UserSchema);
var userData = new User();

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({host: 'localhost', port: 8080 });

server.route({
    method: 'GET',
    path: '/getName',
    handler: function (request, reply) {
      User.findOne({'name':'Gaurav Chauriya'}, function(err, user) {
            if (!err) {
                reply(user.name);
            } else {
                reply(err); // 500 error
            }
        });
      }
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {

      User.find({}, function(err, user) {
            if (!err) {
                reply(user);
            } else {
                reply(err); // 500 error
            }
        });
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
