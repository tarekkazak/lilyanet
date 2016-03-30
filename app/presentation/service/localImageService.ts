import {IImageService} from './IImageService';
export class LocalImageService implements IImageService {

    constructor(private localImageUrl){}

    search(searchTerm) {
        
        searchTerm = searchTerm.toLowerCase();

        var results = [
            {
                url : this.localImageUrl + searchTerm + '/1.jpg'
            },
            {
                url : this.localImageUrl + searchTerm + '/2.jpg'
            },
            {
                url : this.localImageUrl + searchTerm + '/3.jpg'
            },
            {
                url : this.localImageUrl + searchTerm + '/4.jpg'
            }
        ]; 
        console.log('search term', searchTerm);
        return Promise.resolve(results);
    }

}
