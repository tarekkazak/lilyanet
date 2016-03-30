import {IOEvents as IO_EVENT} from '../../common/events';
import {AbstractMediator} from './abstractMediator';
export class WordMediator extends AbstractMediator {

    
    constructor(component:any) {
        super(component);
        this.messageBus.on(IO_EVENT.LETTER_UPDATED, this.updateView);
    }

    private updateView(payload) {
        var letters = payload.letters;
        this.component.setState({
            letters : letters
        }, ()=> {
            this.messageBus.emit(IO_EVENT.VIEW_UPDATED)
        });
    }
}
