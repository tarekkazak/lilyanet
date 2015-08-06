var React = require('react/addons');
var _ = require('lodash');
var Letter = require('./letter.jsx');
var ImageLoader = require('./imageLoader.jsx');
var $ = require('jquery');

var Word = React.createClass({
    componentDidMount : function() {
        var self = this;
        React.findDOMNode(self.refs.hInput).focus();
    },
    onInputChange :function(e) {
        var value = e.target.value;
        location.href = '/word?word=' + value;
    },
    render : function() {
        var self = this;
        var imageLoader;
        var word = '', letters = _.map(this.props.letters, function(item) {
            word += item.character;
            console.log('id', item.id);
            return (
                    <Letter key={item.id} character={item.character} color={item.color}  /> 
                );
        });
        
        return(
                <div >
                    {letters}
                <ImageLoader  word={word}/>
                    <input onChange={this.onInputChange} type="text" ref="hInput" />
                </div>
              );
    }
});

module.exports = Word;
