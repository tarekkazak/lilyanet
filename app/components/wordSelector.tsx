import {monads} from 'folktale/control';
import {Maybe} from 'folktale/data';
var React = require('react/addons');

export class WordSelector extends React.Component {
    constructor(public props) {
        super(props);
    }

    onSelectWord(e) {
        console.log('selected', e.currentTarget);
    }

    render() {
        var css = this.props.word.selected ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-default'; 
        var item = Maybe.of(this.props.word).map((word) => (<li className={css}><button onClick={this.onSelectWord} className="close">{word}<span aria-hidden="true">x</span></button></li>)).get();
        return (
                <div>{item}</div>
               );
    }
}
