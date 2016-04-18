/// <reference path="../../../typings/tsd.d.ts" />
import {IOEvents as IO_EVENT} from '../../common/events';
import {messageService} from '../../common/appContainer';

@messageService
export class LetterGenerator {

    public messageService;

    private generateLetter;
    private gen:any;

    constructor(private model,  private mode) {
        if(!this.mode) {
            this.mode = 'default';
        }
    }

    start() {
        var startGenerator = () => {
        console.log('start generation');
            return this.model.getSelectedWords().then((words) => {
                var gen = this.generateLetter(words);
                return [gen, gen.next().value];
            });
        };

        startGenerator().then((result) => {
            this.gen =result[0];
            var generated = result[1];
            this.messageService.sendMessage(IO_EVENT.LETTER_UPDATED, generated);
            console.log('generator start', generated);

        });

    }

    init() {

        this.generateLetter = function* (words):any {
            for(let word of words) {
                let letters = [];
                for(let letter of word.value) {
                    letters.push(letter.toUpperCase());
                    yield {complete:false, letters : letters };
                }
                yield {complete : true, word:word};
            }
        };

        this.messageService.on(IO_EVENT.VIEW_UPDATED, () => {
            var wait = 1300;
            var generated =  this.gen.next().value;
            //console.log('generated', generated);
            this.messageService.sendMessage(IO_EVENT.WORD_COMPLETE, {complete : false}, 0);
            if(generated.complete === true) {
                var word = generated.word;
                var next = this.gen.next();
                generated = next.value;
                this.messageService.sendMessage(IO_EVENT.WORD_COMPLETE, {complete : true, images : word.images}, 0);
                if(next.done) {
                    setTimeout(() => this.start(), 3500);
                    return;
                } else {
                //console.log('generated word', word.value, word.images.length);
                    wait = 5000;
                }
             }
             
            this.messageService.sendMessage(IO_EVENT.LETTER_UPDATED, generated, wait);
        });
        
        this.start();
    }
}
