var model = require('../model/dataModel.js');

function LocalImageService() {

    this.search = function(searchTerm) {
        if(!model.containsWord(searchTerm)) {
            return;
        }

        searchTerm = searchTerm.toLowerCase();

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
        return Promise.resolve(results);
    }

}

module.exports = new LocalImageService();
