var model = require('../model/dataModel.js');

function GoogleImageService() {

    var promise = new Promise((resolve, reject) => {
        
        function OnLoad() {
            // Create an Image Search instance.
            var imageSearch = new google.search.ImageSearch();
            resolve(imageSearch);
        }
        
        if(google) {
            google.load('search', '1', {language:'fr'});
            google.setOnLoadCallback(OnLoad);
        }
    });




    this.search = function(searchTerm) {
        var self = this;

        return promise.then((imageSearch) => {
            var resultPromise = new Promise((resolve, reject) => {
                function searchComplete() {
                    resolve(imageSearch.results);
                }

                imageSearch.setSearchCompleteCallback(self, searchComplete, null);
                
                if(model.containsWord(searchTerm)) {
                    imageSearch.execute(model.getSearchTerm(searchTerm));
                }
                
            });


            return resultPromise;
        });

    };

}

module.exports = new GoogleImageService();
