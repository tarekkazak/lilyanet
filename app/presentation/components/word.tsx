var monads = require('folktale/control').monads;
var Maybe = require('folktale/data').Maybe;
import _ = require('lodash');
import {Letter} from './letter';
import React = require('react');
import ReactDOM = require('react-dom');

export class Word extends React.Component<any,any> {
    public state;
    public refs;

    constructor(props) {
        super(props);
        this.state = {
            letters : []
        };
    }

    componentDidMount() {
        (ReactDOM.findDOMNode(this.refs.hInput) as HTMLInputElement).focus();
    }

    onInputChange(e) {
        var value = e.target.value;
        //location.href = '/letter?letter=' + value;
    }


    render() {
        var lettersTransform = _.compose( monads.map((character, id) => ({id, character})), 
                monads.map((x) => x.replace(' ', '\u00a0')));
        
        var lettersForWord = lettersTransform(this.state.letters);
        var word = this.state.letters.join(''); 
        var letters = _.map(lettersForWord, function(item:any) {
            return (
                    <Letter key={item.id} data={item} character={item.character}  /> 
                );
        });


        return(
                <div>
                    <div>
                        {letters}
                        <input onChange={this.onInputChange} type="text" ref="hInput" />
                    </div>
                </div>
              );
    }
}

