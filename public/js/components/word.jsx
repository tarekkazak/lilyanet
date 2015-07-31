var React = require('react/addons');
var _ = require('lodash');
var Letter = require('./letter.jsx');
var ImageLoader = require('./imageLoader.jsx');

var Word = React.createClass({
    render : () => {
        var self = this;
        console.log(this.props.letters);
        var word = '', letters = _.map(this.props.letters, function(item) {
            if(self.props.wordComplete) {
                word += item.character;
            }
            return (
                   <Letter key={item.id} character={item.character} color={item.color}  /> 
                );
        });
        return(
                <div >
                    {letters}
                </div>
              );
    }
});

module.exports = Word;
