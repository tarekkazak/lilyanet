var model = require('../model/dataModel.js');

function LocalImageService() {

    this.search = function(searchTerm, searchCallback) {
        if(!model.containsWord(searchTerm)) {
            return;
        }

        var results = [
            {
                url : model.localImageUrl + searchTerm + '/1.jpg'
            },
            {
                url : model.localImageUrl + searchTerm + '/2.jpg'
            },
            {
                url : model.localImageUrl + searchTerm + '/3.jpg'
            },
            {
                url : model.localImageUrl + searchTerm + '/4.jpg'
            }
        ]; 
        console.log('search term', searchTerm);
        searchCallback(results);
    }

    this.init = function(callback) {
      callback(); 
    }


}

module.exports = new LocalImageService();
