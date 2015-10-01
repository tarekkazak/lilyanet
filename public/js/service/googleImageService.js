export class GoogleImageService {
    constructor(model) {
        this.model = model;
        this.promise = new Promise((resolve, reject) => {
            
            function OnLoad() {
                // Create an Image Search instance.
                var imageSearch = new google.search.ImageSearch();
                imageSearch.setResultSetSize(8);
                resolve(imageSearch);
            }
            
            if(google) {
                google.load('search', '1', {language:'fr'});
                google.setOnLoadCallback(OnLoad);
            }
        });
    }





    search(searchTerm) {
        var self = this;

        return this.promise.then((imageSearch) => {
            var resultPromise = new Promise((resolve, reject) => {
                function searchComplete() {
                    resolve(imageSearch.results.map((item) => ({url : item.tbUrl}) ));
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

