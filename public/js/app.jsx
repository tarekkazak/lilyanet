var IO_EVENT = require('../../app/common/events.js').ioEvents;
var io = require('socket.io-client')
var socket = io(window.socketServer);
var React = require('react/addons');
var Word = require('./components/word.jsx');
import { model } from '../../app/common/appContainer.js';
var index = 0;
var l = window.letters;

var wordComp = React.render(<Word isLocalResource={window.isLocalResource} words={model.getWords()}  letters={l}/>, document.getElementById('container'), () => {
    socket.emit(IO_EVENT.RENDER_COMPLETE);
});

function updateView(payload) {
    var letter = payload.letter;
    console.log('socket', letter.toUpperCase());
    model.letters.push(letter);
    wordComp.setState({
        letters : model.letters,
        words : model.getWords(),
        isLocalResource : model.isResourceLocal()
    }, ()=> {
        console.log('state set');
        if(model.wordComplete()) { 
            model.letters = [];
        }
        socket.emit(IO_EVENT.VIEW_UPDATED)
    });
}

socket.on(IO_EVENT.LETTER_UPDATED, updateView);
