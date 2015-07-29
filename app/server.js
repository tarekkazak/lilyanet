'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var LetterController = require('./controller/letter/letter.js');
var letterRoutes = new LetterController(io).routes;
var IO_EVENT = require('./app/common/events');

io.on('connection', (socket) => {
    console.log('connected');
});

app.use(bodyParser.json());
app.set('views', 'views');
app.use(express.static(__dirname + 'public/js/bundle.js'));

for (let route of letterRoutes) {
   var ct = app.route(route.path);

   for(let verb in route) {
       if(verb !== 'path') {
        ct[verb].apply(letterRoutes, route[verb]);
       }
   }
}
io.listen(3300);
app.listen(2200, function() {
    console.log('running on 2200');   
});
