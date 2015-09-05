var React  = require('react/addons');
var _ = require('lodash');
var imageServiceProvider = require('../service/imageServiceProvider.js');
var imageService;
var images = (<div/>);
var searchTerm = '';
var foundImages = false;
var style = {
        visibility : 'hidden'
    };

function fetchImages() {
    var self = this;
    imageService = imageServiceProvider.get(this.props.local);

    
    function searchComplete(results) {
        console.log(results);
        if(results && results.length) {
            foundImages = true;
            images = _.map(results, (item) =>{
                return (
                        <img key={item.url}width="200" height="200" src={item.url} />
                       );
            });

            self.forceUpdate();
        } 
    }
        
    if(searchTerm !== this.props.word){
        searchTerm = this.props.word; 
        imageService.search(searchTerm).then(searchComplete);
    }

}

var ImageLoader = React.createClass({
    componentDidMount : fetchImages,
    componentDidUpdate : fetchImages,
    render : function() {
        style.visibility = foundImages ? 'visible' : 'hidden';
        foundImages = false;
        return (
                <div style={style}>{images}</div>
               );
        
    }
});

module.exports = ImageLoader;
