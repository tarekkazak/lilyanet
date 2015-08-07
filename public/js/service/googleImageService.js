var model = require('../model/dataModel.js');

function GoogleImageLoader() {
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
        
        console.log('search term', searchTerm);
        if(model.containsWord(searchTerm)) {
            imageSearch.execute(searchTerm);
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

module.exports = new GoogleImageLoader();
