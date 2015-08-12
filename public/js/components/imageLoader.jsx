var React  = require('react/addons');
var _ = require('lodash');
var imageServiceProvider = require('../service/imageServiceProvider.js');
var imageService;
var images = (<div/>);
var searchTerm = '';

var ImageLoader = React.createClass({
    componentDidUpdate : function() {
        imageService = imageServiceProvider.get(this.props.local);
        var self = this; 

        function serviceReady() {
            imageService.search(searchTerm, searchComplete);
        } 
       
        function searchComplete(results) {
            console.log(results);
            if(results && results.length) {
                images = _.map(results, (item) =>{
                    return (
                            <img key={item.url}width="300" height="300" src={item.url} />
                           );
                });

                self.forceUpdate();
            }
        }
            
        if(searchTerm !== this.props.word){
            searchTerm = this.props.word; 
            imageService.init(serviceReady);
        }
    },
    render : function() {

        return (
                <div>{images}</div>
               );
        
    }
});

module.exports = ImageLoader;
