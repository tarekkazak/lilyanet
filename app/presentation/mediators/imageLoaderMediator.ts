import {IOEvents as IO_EVENT} from '../../common/events';
import {AbstractMediator} from './abstractMediator';
import {IImageService} from '../service/IImageService';

export class ImageLoaderMediator extends AbstractMediator {

    constructor(component:any) {
        super(component);
        this.messageBus.on(IO_EVENT.WORD_COMPLETE, this.updateView.bind(this));
    }


    private updateView(payload) {

        this.component.setState({
            images : payload.complete ? payload.images : []
        });
    }
}
