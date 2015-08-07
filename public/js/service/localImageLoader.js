var model = require('../model/dataModel.js');

function LocalImageLoader() {

    this.search = function(searchTerm, searchCallback) {

        var results = [
            {
                url : model.localImageUrl + searchTerm + '/1.png'
            },
            {
                url : model.localImageUrl + searchTerm + '/2.png'
            },
            {
                url : model.localImageUrl + searchTerm + '/3.png'
            },
            {
                url : model.localImageUrl + searchTerm + '/4.png'
            }
        ]; 
        console.log('search term', searchTerm);
        searchCallback(results);
    }

    this.init = function(callback) {
      callback(); 
    }


}

module.exports = new LocalImageLoader();
