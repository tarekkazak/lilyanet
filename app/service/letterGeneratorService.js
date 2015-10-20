var IO_EVENT = require('../common/events').ioEvents;

import { MessageService } from './messageService.js';

export class LetterGenerator {
    
    constructor(model, io, socket, mode = 'default') {
        this.mode = mode;
        this.init(io, model, socket);
    }


    init(io, model, socket) {
        var messageService;

        function* generateLetter(words) {
            console.log('generate letter');
            for(let word of words) {
                for(let letter of word) {
                    yield letter;
                }
                yield word;
            }
        }

        var startGenerator = function() {
            console.log('start generation');
            var words = model.getWords(this.mode);
            console.log(words);
            var gen = generateLetter(words);
            return [gen, gen.next().value];
        }.bind(this);

        var ioConnectionPromise = new Promise((resolve, reject) => {
                messageService = new MessageService(io, socket);
                
                socket.on(IO_EVENT.RENDER_COMPLETE, () => {
                    console.log('first render');
                    console.log('socket', socket.id);
                    resolve(socket);
                });
        });

        ioConnectionPromise.then((socket) => {
            var [gen, letter] = startGenerator();
            messageService.sendMessage(IO_EVENT.LETTER_UPDATED, {letter : letter.toUpperCase()});

            socket.on(IO_EVENT.VIEW_UPDATED, () => {
                var wait = 1300;
                letter =  gen.next().value;
                console.log('generated', letter);
                if(model.containsWord(letter)) {
                    var next = gen.next();
                    letter = next.value;
                    if(next.done) {
                        [gen, letter] = startGenerator();
                    } else {
                        wait = 5000;
                    }
                } 
                
                messageService.sendMessage(IO_EVENT.LETTER_UPDATED, {letter : letter.toUpperCase()}, wait);
            });
        });

    }
}
