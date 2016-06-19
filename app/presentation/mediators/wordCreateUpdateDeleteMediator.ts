import {IOEvents as IO_EVENT} from '../../common/events';
import {AbstractMediator} from './abstractMediator';
import {Signal} from 'signals';
export class WordCreateUpdateDeleteMediator extends AbstractMediator {
    
    constructor(component) {
        super(component);

        component.addWordSignal = new Signal();
        component.addWordSignal.add(this.onAddWord.bind(this));

        component.selectWordSignal = new Signal();
        component.selectWordSignal.add(this.onSelectWord.bind(this));

        component.updateWordSignal = new Signal();
        component.updateWordSignal.add(this.onUpdateWord.bind(this));

        component.deleteWordSignal = new Signal();
        component.deleteWordSignal.add(this.onDeleteWord.bind(this));

    }

    private onAddWord(word) {
        this.messageBus.emit(IO_EVENT.ADD_WORD, word);
    }

    private onSelectWord(word) {
        this.messageBus.emit(IO_EVENT.SELECT_WORD, word);
    }

    private onDeleteWord(word) {
        this.messageBus.emit(IO_EVENT.DELETE_WORD, word);
    }

    private onUpdateWord(word) {
        this.messageBus.emit(IO_EVENT.UPDATE_WORD, word);
    }

}
