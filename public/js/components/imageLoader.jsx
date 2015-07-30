var React  = require('react/addons');
var _ = require('lodash');

var ImageLoader = React.createClass({
    render :  () => {
        var results, imageSearch, images;
        google.load('search', '1');
        google.setOnLoadCallback(OnLoad);

        function searchComplete() {
            if (imageSearch.results && imageSearch.results.length ) {
                // Grab our content div, clear it.
                results = imageSearch.results;
                this.forceUpdate();
            }         
        }

        function OnLoad() {
                      
            // Create an Image Search instance.
            imageSearch = new google.search.ImageSearch();
            imageSearch.setSearchCompleteCallback(this, searchComplete, null);
            imageSearch.execute(this.props.word);
            google.search.Search.getBranding('branding');
        }
        
        if(results.length > 0) {
                // There is also a result.url property which has the escaped version
            //newImg.src="/image-search/v1/result.tbUrl;"
            images = _.map(results, (item) =>{
                return (
                        <img width="400" height="400" src={item.url} />
                       );
            });
        }
        return (
                <div>{images}</div>
               );
        
    }
});

module.exports = ImageLoader;
