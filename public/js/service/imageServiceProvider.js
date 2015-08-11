function ImageServiceProvider () {
    var googleImageService = require('./googleImageService.js');
    var localImageService = require('./localImageService.js');

    this.get = function(local) {
        if(local) {
            console.log('local');
            return localImageService;
        } else {
            console.log('remote');
            return googleImageService;
        }
    };
       
}

module.exports = new ImageServiceProvider();
