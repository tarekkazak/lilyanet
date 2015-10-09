import { GoogleImageService } from './googleImageService.js'
import { LocalImageService } from './localImageService.js'
import model from '../../../app/common/appContainer.js';

export class ImageServiceProvider {

    constructor() {
        this.googleImageService = new GoogleImageService(model);
        this.localImageService = new  LocalImageService(model);
    }

    get(local) {
        if(local) {
            return this.localImageService;
        } else {
            return this.googleImageService;
        }
    }
       
}

