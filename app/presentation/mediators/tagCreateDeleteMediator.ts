import {IOEvents as IO_EVENT} from '../../common/events';
import {AbstractMediator} from './abstractMediator';
import {Signal} from 'signals';
export class TagCreateDeleteMediator extends AbstractMediator {
    
    constructor(component) {
        super(component);
        component.addTagSignal = new Signal();
        component.addTagSignal.add(this.onAddTag.bind(this));

        component.deleteTagSignal = new Signal();
        component.deleteTagSignal.add(this.onDeleteTag.bind(this));
    }

    private onAddTag(tag) {
        this.messageBus.emit(IO_EVENT.ADD_TAG, tag);
    }

    private onDeleteTag(tag) {
        this.messageBus.emit(IO_EVENT.DELETE_WORD, tag);
    }
}
