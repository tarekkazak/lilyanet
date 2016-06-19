import {IOEvents as IO_EVENT} from '../../common/events';
import {AbstractMediator} from './abstractMediator';

export class WordDependentMediator extends AbstractMediator {
    
    constructor(component) {
        super(component);
        this.messageBus.on(IO_EVENT.WORD_LIST_UPDATED, this.updateView.bind(this));
    }


    private updateView(payload) {
        console.log('word dep media', payload);
        this.component.setState({words : payload});
    }
}
