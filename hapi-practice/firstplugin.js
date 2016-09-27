var firstRoute = {
    register: function (server, options, next){

      server.route({
        method: 'GET',
        path: '/',
        handler: function(request, reply){
          reply('hello, this is first plugin, and it\'s working!!')
        }
      });
      next();
    }
};

firstRoute.register.attributes = {
  name:'firstplugin',
  version: '1.0.0'
};

module.exports = firstRoute;
