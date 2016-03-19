import {monads} from 'folktale/control';
import {Maybe} from 'folktale/data';
import {ImageLoader} from './imageLoader';
import {_} from 'lodash';
import {Letter} from './letter';
import {WordSelector} from './wordSelector';
var React = require('react/addons');

export class Word extends React.Component {
    public state;
    public refs;

    constructor(private props) {
        super(props);
        this.state = {
            letters : [],
            words : [],
            isLocalResource : false
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
        var word = this.state.letters.join(''); 
        var letters = _.map(lettersForWord, function(item) {
            return (
                    <Letter key={item.id} data={item} character={item.character}  /> 
                );
        });


        var words = _.map(this.state.words, (item, index) => (<WordSelector key={index} word={item}/>));


        console.log('word component generated word', word, lettersForWord, this.state.words);
        return(
                <div>
                    <div>
                        <ul className="list-inline">{words}</ul>
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

