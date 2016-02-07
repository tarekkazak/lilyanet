import { GoogleImageService } from './googleImageService'
import { LocalImageService } from './localImageService'
import { appContainer } from '../common/appContainer';

export class ImageServiceProvider {
    private googleImageService;
    private localImageService;

    constructor() {
        this.googleImageService = new GoogleImageService(appContainer.model);
        this.localImageService = new  LocalImageService(appContainer.model);
    }

    get(local) {
        if(local) {
            return this.localImageService;
        } else {
            return this.googleImageService;
        }
    }
       
}

