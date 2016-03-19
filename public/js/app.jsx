import {ioEvents as IO_EVENT} from '../../app/common/events';
import {Word} from '../../app/components/word.jsx';
var io = require('socket.io-client')
var socket = io(container.socketServer);
var React = require('react/addons');

var wordComp = React.render(<Word />, document.getElementById('container'), () => {
    socket.emit(IO_EVENT.RENDER_COMPLETE);
});

function updateView(payload) {
    var letter = payload.letter;
    console.log('socket', letter.toUpperCase());
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
