import { DataModel } from '../../public/js/model/dataModel.js';

class AppContainer {
    constructor() {
        this.model = new DataModel();
    }
}

export var appContainer = new AppContainer();
