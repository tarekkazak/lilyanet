import { GoogleImageService } from './googleImageService'
import { LocalImageService } from './localImageService'

export class ImageServiceProvider {
    private googleImageService;
    private localImageService;

    constructor() {
        this.googleImageService = new GoogleImageService();
        this.localImageService = new  LocalImageService('/images/');
    }

    get(local) {
        if(local) {
            return this.localImageService;
        } else {
            return this.googleImageService;
        }
    }
       
}

