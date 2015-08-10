var React = require('react/addons');
var _ = require('lodash');
var Letter = require('./letter.jsx');
var ImageLoader = require('./imageLoader.jsx');
var $ = require('jquery');

var Word = React.createClass({
    getInitialState : function() {
        return {letters : this.props.letters};
    },
    componentDidMount : function() {
        var self = this,
            index = 0;
        React.findDOMNode(self.refs.hInput).focus();
        /*setInterval(() => {
            self.state.letters = self.props.words[index].split('');
            index++;
            self.forceUpdate();
        }, 10000);*/
    },
    onInputChange :function(e) {
        var value = e.target.value;
        location.href = '/letter?letter=' + value;
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

        var words = _.map(this.props.words, (item) => (<li>{item}</li>));
        
        return(
                <div>
                    <div style={{ float:"left" }} >
                        {letters}
                        <ImageLoader local={this.props.isLocalResource} word={word}/>
                        <input onChange={this.onInputChange} type="text" ref="hInput" />
                    </div>
                    <div style={{ float:"right" }} >
                        <ul>{words}</ul>
                    </div>
                </div>
              );
    }
});

module.exports = Word;
