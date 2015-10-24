var React  = require('react/addons');
import {_} from 'lodash';
import {ImageServiceProvider} from '../service/imageServiceProvider.js';


export class ImageLoader extends React.Component {
    constructor(props) {
        super(props)
        //TODO:make private
        this.images = (<div/>);
        this.foundImages = false;
        this.searchTerm = '';
    }

     fetchImages() {
        var imageServiceProvider = new ImageServiceProvider();
        var imageService = imageServiceProvider.get(this.props.local);

        
        var searchComplete = (results) => {
            console.log(results);
            if(results && results.length) {
                this.foundImages = true;
                this.images = _.map(results, (item) =>{
                    return (
                            <img key={item.url}width="200" height="200" src={item.url} />
                           );
                });

                this.forceUpdate();
            } 
        };
            
        if(this.searchTerm !== this.props.word){
            this.searchTerm = this.props.word; 
            imageService.search(this.searchTerm).then(searchComplete);
        }

    }

    componentDidMount() {
        this.fetchImages();
    }

    componentDidUpdate() {
        this.fetchImages();
    }

    render() {
        var style = {
            visibility : this.foundImages ? 'visible' : 'hidden'
        };
        this.foundImages = false;
        return (
                <div style={style}>{this.images}</div>
               );
        
    }
}
