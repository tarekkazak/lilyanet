import {IOEvents as IO_EVENT} from '../../common/events';
import {AbstractMediator} from './abstractMediator';

export class TagDependentMediator extends AbstractMediator {
    
    constructor(component) {
        super(component);
        this.messageBus.on(IO_EVENT.TAG_LIST_UPDATED, this.updateView.bind(this));
    }


    private updateView(payload) {
        console.log('tags', payload);
        this.component.setState({tags : payload});
    }
}
