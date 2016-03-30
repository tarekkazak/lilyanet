import {IImageService} from './IImageService';
export class GoogleImageService implements IImageService {
    private promise:any; 
    private google:any;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            
            function OnLoad() {
                // Create an Image Search instance.
                var imageSearch = new this.google.search.ImageSearch();
                imageSearch.setResultSetSize(8);
                resolve(imageSearch);
            }
            
            if(this.google) {
                this.google.load('search', '1', {language:'fr'});
                this.google.setOnLoadCallback(OnLoad);
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
                
                imageSearch.execute(searchTerm);
                
            });


            return resultPromise;
        });

    };

}

