var React = require('react');
var _ = require('lodash');
var Letter = require('./public/js/components/letter.jsx');

var Word = React.createClass({
    render() => {
        var letters = _.map(this.props.letters, function(item) {
            return (
                   <Letter character={item.character} color={item.color}  /> 
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
