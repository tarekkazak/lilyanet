import { GoogleImageService } from './googleImageService.js'
import { LocalImageService } from './localImageService.js'
import { appContainer } from '../common/appContainer.js';

export class ImageServiceProvider {

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

