export class LocalImageService {

    constructor(model) {
        this.model = model;
    }

    search(searchTerm) {
        
        searchTerm = searchTerm.toLowerCase();

        var results = [
            {
                url : this.model.localImageUrl + searchTerm + '/1.jpg'
            },
            {
                url : this.model.localImageUrl + searchTerm + '/2.jpg'
            },
            {
                url : this.model.localImageUrl + searchTerm + '/3.jpg'
            },
            {
                url : this.model.localImageUrl + searchTerm + '/4.jpg'
            }
        ]; 
        console.log('search term', searchTerm);
        return Promise.resolve(this.model.containsWord(searchTerm) ? results : undefined);
    }

}
