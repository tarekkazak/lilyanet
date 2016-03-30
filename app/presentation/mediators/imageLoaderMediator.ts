import {IOEvents as IO_EVENT} from '../../common/events';
import {AbstractMediator} from './abstractMediator';
import {ImageServiceProvider}  from '../service/imageServiceProvider';
import {IImageService} from '../service/IImageService';

export class ImageLoaderMediator extends AbstractMediator {

    
    private imageServiceProvider:ImageServiceProvider;

    constructor(component:any) {
        super(component);
        this.imageServiceProvider = new ImageServiceProvider();
        this.messageBus.on(IO_EVENT.WORD_COMPLETE, this.updateView);
    }


    private updateView(payload) {
        let imageService:IImageService = this.imageServiceProvider.get(payload.isLocal);

        this.component.setState({
            images : imageService.search(payload.searchTerm)
        });
    }
}
