import {monads} from 'folktale/control';
import {Maybe} from 'folktale/data';
var React = require('react/addons');
import {ImageLoader} from './imageLoader.jsx';
import {_} from 'lodash';
import {Letter} from './letter.jsx';

export class Word extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            letters : props.letters,
            words : props.words,
            isLocalResource : props.isLocalResource
        };
    }

    componentDidMount() {
        React.findDOMNode(this.refs.hInput).focus();
    }

    onInputChange(e) {
        var value = e.target.value;
        location.href = '/letter?letter=' + value;
    }

    render() {
        var lettersTransform = _.compose( monads.map((character, id) => ({id, character})), 
                monads.map((x) => x.replace(' ', '\u00a0')));
        
        var lettersForWord = lettersTransform(this.state.letters);
        var word = '', letters = _.map(lettersForWord, function(item) {
            word += item.character;

            return (
                    <Letter key={item.id} data={item} character={item.character}  /> 
                );
        });


        var words = _.map(this.state.words, (item, index) => (<li style={{marginRight : '6px', display : 'inline-block', fontSize : '20px'}} key={index}>{item}</li>));


        console.log('word component generated word', word, lettersForWord, this.state.words);
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
}

