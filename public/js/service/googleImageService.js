var model = require('../model/dataModel.js');

function GoogleImageService() {
        var imageSearch,
        initCallback,
        searchCompleteCallback;

    function OnLoad() {
        // Create an Image Search instance.
        imageSearch = new google.search.ImageSearch();
        initCallback();
    }

    function searchComplete() {
        searchCompleteCallback(imageSearch.results);
    }

    this.search = function(searchTerm, searchCallback) {
        searchCompleteCallback = searchCallback;

        imageSearch.setSearchCompleteCallback(this, searchComplete, null);
        
        if(model.containsWord(searchTerm)) {
            imageSearch.execute(model.getSearchTerm(searchTerm));
        }
        
    }

    this.init = function(callback) {
        initCallback = callback;
       
        if(google) {
            google.load('search', '1', {language:'fr'});
            google.setOnLoadCallback(OnLoad);
        }
    }


}

module.exports = new GoogleImageService();
