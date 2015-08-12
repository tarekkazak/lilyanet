var React = require('react/addons');
var _ = require('lodash');
var Letter = require('./letter.jsx');
var ImageLoader = require('./imageLoader.jsx');
var $ = require('jquery');

var Word = React.createClass({
    getInitialState : function() {
        return {
            letters : this.props.letters,
            words : this.props.words,
            isLocalResource : this.props.isLocalResource
        };
    },
    componentDidMount : function() {
        React.findDOMNode(this.refs.hInput).focus();
    },
    onInputChange :function(e) {
        var value = e.target.value;
        location.href = '/letter?letter=' + value;
    },
    render : function() {
        var self = this;
        var lettersForWord = _.map(this.state.letters, (item, index) => ({id:index, character:item}));
        var imageLoader;
        var word = '', letters = _.map(lettersForWord, function(item) {
            word += item.character;

            return (
                    <Letter key={item.id} data={item} character={item.character}  /> 
                );
        });

        console.log('word', word);

        var words = _.map(this.state.words, (item, index) => (<li style={{marginRight : '6px', display : 'inline-block', fontSize : '20px'}} key={index}>{item}</li>));

        return(
                <div>
                    <div>
                        <ul>{words}</ul>
                    </div>
                    <div>
                        {letters}
                        <ImageLoader local={this.state.isLocalResource} word={word} />
                        <input onChange={this.onInputChange} type="text" ref="hInput" />
                    </div>
                </div>
              );
    }
});

module.exports = Word;
