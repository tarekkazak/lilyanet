var IO_EVENT = require('../common/events');
var MessageService = require('./messageService.js').MessageService;

export class LetterGenerator {
    
    constructor(model, io, socket) {
        this.init(io, model, socket);
    }


    init(io, model, socket) {
        var messageService;

        function* generateLetter(words) {
            for(let word of words) {
                for(let letter of word) {
                    yield letter;
                }
                yield word;
            }
        }

        function startGenerator() {
            console.log('start generation');
            var gen = generateLetter(model.allowedWords);
            return [gen, gen.next().value];
        }

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
                if(letter.length > 1) {
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
