'use strict';

require('node-jsx').install({extension : '.jsx'});
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var LetterController = require('./controller/letters/letters.js');
var letterRoutes = new LetterController(io).routes;
var IO_EVENT = require('./common/events');

io.on('connection', (socket) => {
    console.log('connected');
});
console.log(__dirname + '/../public');
app.use(bodyParser.json());
app.engine('jade', require('jade').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/../public'));

for (let route of letterRoutes) {
   var ct = app.route(route.path);
   for(let verb in route) {
       if(verb !== 'path') {
        ct[verb](route[verb]);
       }
   }
}
io.listen(3300);
app.listen(2200, function() {
    console.log('running on 2200');   
});
