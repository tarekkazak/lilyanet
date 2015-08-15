function ImageServiceProvider () {
    var googleImageService = require('./googleImageService.js');
    var localImageService = require('./localImageService.js');

    this.get = function(local) {
        if(local) {
            return localImageService;
        } else {
            return googleImageService;
        }
    };
       
}

module.exports = new ImageServiceProvider();
