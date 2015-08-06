var model = require('../model/dataModel.js');

module.exports = (function() {

    function OnLoad() {
        // Create an Image Search instance.
        imageSearch = new google.search.ImageSearch();
        initCallback();
    }

    function searchComplete() {
        searchCompleteCallback(imageSearch.results);
    }

    function search(searchTerm, searchCallback) {
        searchCompleteCallback = searchCallback;

        imageSearch.setSearchCompleteCallback(this, searchComplete, null);
        
        console.log('search term', searchTerm);
        if(model.containsWord(searchTerm)) {
            imageSearch.execute(searchTerm);
        }
        
    }

    function init(callback) {
        initCallback = callback;
        if(root.google) {
            root.google.load('search', '1', {language:'fr'});
            root.google.setOnLoadCallback(OnLoad);
        }
    }

    var root = this,
        imageSearch,
        initCallback,
        searchCompleteCallback, 
        service = {
            init : init,
            search : search
        };

    return service;
})();
