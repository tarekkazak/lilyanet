import {IOEvents as IO_EVENT} from '../../common/events';
import {AbstractMediator} from './abstractMediator';
import {Signal} from 'signals';
export class WordSelectorMediator extends AbstractMediator {
    
    constructor(component) {
        super(component);
        component.addTagSignal = new Signal();
        component.addTagSignal.add(this.onAddTag.bind(this));

        component.deleteTagSignal = new Signal();
        component.deleteTagSignal.add(this.onDeleteTag.bind(this));

        component.addWordSignal = new Signal();
        component.addWordSignal.add(this.onAddWord.bind(this));

        component.selectWordSignal = new Signal();
        component.selectWordSignal.add(this.onSelectWord.bind(this));

        component.updateWordSignal = new Signal();
        component.updateWordSignal.add(this.onUpdateWord.bind(this));

        component.deleteWordSignal = new Signal();
        component.deleteWordSignal.add(this.onDeleteWord.bind(this));

        this.messageBus.on(IO_EVENT.WORD_LIST_UPDATED, this.updateView.bind(this));
        this.messageBus.on(IO_EVENT.TAG_LIST_UPDATED, this.updateView.bind(this));
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

    private onAddTag(tag) {
        this.messageBus.emit(IO_EVENT.ADD_TAG, tag);
    }

    private onDeleteTag(tag) {
        this.messageBus.emit(IO_EVENT.DELETE_WORD, tag);
    }

    private updateView(payload) {
        this.component.setState(payload);
    }
}
