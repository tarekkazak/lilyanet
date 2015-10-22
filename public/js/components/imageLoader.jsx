var React  = require('react/addons');
import {_} from 'lodash';
import {ImageServiceProvider} from '../service/imageServiceProvider.js';
var imageServiceProvider = new ImageServiceProvider();
var imageService;
var images = (<div/>);
var searchTerm = '';
var foundImages = false;
var style = {
        visibility : 'hidden'
    };


export class ImageLoader extends React.Component {
    constructor(props) {
        super(props)
    }

     fetchImages() {
        imageService = imageServiceProvider.get(this.props.local);

        
        var searchComplete = (results) => {
            console.log(results);
            if(results && results.length) {
                foundImages = true;
                images = _.map(results, (item) =>{
                    return (
                            <img key={item.url}width="200" height="200" src={item.url} />
                           );
                });

                this.forceUpdate();
            } 
        };
            
        if(searchTerm !== this.props.word){
            searchTerm = this.props.word; 
            imageService.search(searchTerm).then(searchComplete);
        }

    }

    componentDidMount() {
        this.fetchImages();
    }

    componentDidUpdate() {
        this.fetchImages();
    }

    render() {
        style.visibility = foundImages ? 'visible' : 'hidden';
        foundImages = false;
        return (
                <div style={style}>{images}</div>
               );
        
    }
}
