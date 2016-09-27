'use strict';
var myDetails = {
      name: 'Gaurav Chauriya',
      Education: 'M.C.A',
      HomeTown: 'Nagpur'
  };

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 8080 });

server.route({
    method: 'GET',
    path: '/getName',
    handler: function (request, reply) {
        reply(myDetails.name);
    }
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply(myDetails);
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
