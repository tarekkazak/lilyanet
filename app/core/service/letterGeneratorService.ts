/// <reference path="../../../typings/tsd.d.ts" />
import {IOEvents as IO_EVENT} from '../../common/events';
import {messageService} from '../../common/appContainer';

export class LetterGenerator {

    @messageService
    public messageService;

    constructor(private model,  private mode) {
        if(!this.mode) {
            this.mode = 'default';
        }
    }

    init() {

        function* generateLetter(words):any {
            for(let word of words) {
                let letters = [];
                for(let letter of word) {
                    letters.push(letter.toUpperCase());
                    yield {complete:false, letters : letters };
                }
                yield {complete : true, word:word};
            }
        }

        var startGenerator = () => {
            console.log('start generation');
            var words = this.model.getWordList();
            console.log(words);
            var gen = generateLetter(words);
            return [gen, gen.next().value];
        };

        var ioConnectionPromise = new Promise((resolve, reject) => {
                this.messageService.on(IO_EVENT.RENDER_COMPLETE, () => {
                    console.log('first render');
                    resolve();
                });
        });

        ioConnectionPromise.then(() => {
            var result = startGenerator();
            var gen =result[0];
            var generated = result[1];
            this.messageService.sendMessage(IO_EVENT.LETTER_UPDATED, generated);

            this.messageService.on(IO_EVENT.VIEW_UPDATED, () => {
                var wait = 1300;
                generated =  gen.next().value;
                console.log('generated', generated);
                if(generated.complete === true) {
                    var next = gen.next();
                    generated = next.value;
                    if(next.done) {
                        result = startGenerator();
                        gen = result[0];
                        generated = result[1];
                    } else {
                        this.messageService.sendMessage(IO_EVENT.WORD_COMPLETE, generated.word, 0);
                        wait = 5000;
                    }
                } 
                
                this.messageService.sendMessage(IO_EVENT.LETTER_UPDATED, generated, wait);
            });
        });

    }
}
