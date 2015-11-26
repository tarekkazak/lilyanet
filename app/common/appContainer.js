import { LilyaNet } from '../model/lilyanet.js';
import { LilyaNetDao } from '../model/lilyanetDao.js';

class AppContainer {
    constructor() {
        this.model = new LilyaNet(new LilyaNetDao());
    }
}

export var appContainer = new AppContainer();
