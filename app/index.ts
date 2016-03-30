var express = require('express');
import {LetterController} from './core/controller/letters/letters';
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(3300);
var letterRoutes = new LetterController(io).routes;

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


app.listen(process.env.PORT || 80, function() {
    console.log('running on ', process.env.PORT);   
    console.log('socket on ', process.env.SOCKET_SERVER);   
});
