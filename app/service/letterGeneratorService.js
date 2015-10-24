import {ioEvents as IO_EVENT} from '../common/events';
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
                    yield {letter : letter.toUpperCase() };
                }
                yield true;
            }
        }

        var startGenerator = () => {
            console.log('start generation');
            var words = model.getWords(this.mode);
            console.log(words);
            var gen = generateLetter(words);
            return [gen, gen.next().value];
        };

        var ioConnectionPromise = new Promise((resolve, reject) => {
                messageService = new MessageService(io, socket);
                
                socket.on(IO_EVENT.RENDER_COMPLETE, () => {
                    console.log('first render');
                    console.log('socket', socket.id);
                    resolve(socket);
                });
        });

        ioConnectionPromise.then((socket) => {
            var [gen, generated] = startGenerator();
            messageService.sendMessage(IO_EVENT.LETTER_UPDATED, generated);

            socket.on(IO_EVENT.VIEW_UPDATED, () => {
                var wait = 1300;
                generated =  gen.next().value;
                console.log('generated', generated);
                if(generated === true) {
                    var next = gen.next();
                    generated = next.value;
                    if(next.done) {
                        [gen, generated] = startGenerator();
                    } else {
                        wait = 5000;
                    }
                } 
                
                messageService.sendMessage(IO_EVENT.LETTER_UPDATED, generated, wait);
            });
        });

    }
}
