var React  = require('react/addons');
var _ = require('lodash');
var imageService = require('../service/imageService.js');
var images = (<div/>);
var searchTerm = '';

var ImageLoader = React.createClass({
    componentDidMount : function() {
        var self = this; 

        function serviceReady() {
            imageService.search(searchTerm, searchComplete);
        } 
       
        function searchComplete(results) {
            console.log(results);
            if(results && results.length) {
                images = _.map(results, (item) =>{
                    return (
                            <img key={item.url}width="400" height="400" src={item.url} />
                           );
                });

                self.forceUpdate();
            }
        }
        if(!images.length) {
            imageService.init(serviceReady);
        }
    },
    render : function() {
        searchTerm = this.props.word;

        return (
                <div>{images}</div>
               );
        
    }
});

module.exports = ImageLoader;
