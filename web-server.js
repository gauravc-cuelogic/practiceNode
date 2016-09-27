 var http = require('http');

 var s =  http.createServer(function(req, res) {
		res.writeHead(200, { 'content-type': 'text/plain' });
    setTimeout(function(){
      res.end("hello world\n");
    },2000)

	 });
 	s.listen(8080);
