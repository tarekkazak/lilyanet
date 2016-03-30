import {messageBus} from '../../common/appContainer';

export abstract class AbstractMediator {

    @messageBus
    public messageBus;
    
    constructor(protected component) {
    }

}
