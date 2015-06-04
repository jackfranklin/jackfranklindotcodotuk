var cannon = require('cannon');
var express = require('express');
var http = require('http');

var app = express();

app.use(express.static('public'));

app.use(cannon.init());

app.use(cannon.pages({
  directory: 'pages',
  glob: '*.js'
}));

app.use(cannon.posts({
  directory: 'posts',
  glob: '*.js'
}));


app.use(cannon.exposeRoutes());

app.use(cannon.render());

var server = http.createServer(app);

server.listen('8008');

server.on('listening', function() {
  console.log('Server running on localhost:8123');
});


