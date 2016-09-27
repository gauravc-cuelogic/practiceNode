'use strict'

const hapi = require('hapi');
const server = new hapi.Server();

server.connection({
  host: 'localhost',
  port: '3000'
});

server.register({
  register: require('./firstplugin')
});


server.start(function(err) {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
