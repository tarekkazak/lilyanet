export class LocalImageService {

    constructor(model) {
        this.model = model;
    }

    search(searchTerm) {
        if(!this.model.containsWord(searchTerm)) {
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
