var monads = require('folktale/control').monads;
var Maybe = require('folktale/data').Maybe;
import React = require('react');
import $ = require('jquery');
import ReactDOM = require('react-dom');
import { Signal } from 'signals';

export class WordSelector extends React.Component<any, any> {
    
    public addWordSignal:Signal;
    public selectWordSignal:Signal;
    public deleteWordSignal:Signal;
    public refs;

    constructor(props) {
        super(props);
        this.state = {
            words : []
        };
        this.onSelectWord = this.onSelectWord.bind(this);
        this.deleteWord = this.deleteWord.bind(this);
    }

    onSelectWord(e) {
        let id = $(e.target).closest('[data-model]').attr('data-model');
        let word = this.state.words.filter((item) => item._id === id)[0]
        this.selectWordSignal.dispatch(word);
    }

    deleteWord(e) {
        e.preventDefault();
        e.stopPropagation();
        let id = $(e.target).closest('[data-model]').attr('data-model');
        let word = this.state.words.filter((item) => item._id === id)[0]
        this.deleteWordSignal.dispatch(word);
    }

    addWord(e) {
        let word = {
           value : (ReactDOM.findDOMNode(this.refs.wordInput) as HTMLInputElement).value,
           searchTerm : (ReactDOM.findDOMNode(this.refs.searchTerm) as HTMLInputElement).value,
           location : (ReactDOM.findDOMNode(this.refs.location) as HTMLInputElement).value,
           syllables : (ReactDOM.findDOMNode(this.refs.syllables) as HTMLInputElement).value.split(',')
        };

        this.addWordSignal.dispatch(word);
    }

    private getClass(selected) {
        return selected ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-default'; 
    }

    render() {
        let items = this.state.words.map((word) => (
            <li key={word._id} >
                <button  data-model={word._id} className={this.getClass(word.selected)} onClick={this.onSelectWord} >
                    {word.value}
                    <button type="button" onClick={this.deleteWord} className="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </button>
            </li>)
        );
        return (
                <div className="form-horizontal">
                    <div className="form-group">
                        <label className="col-md-2">Add Word</label>
                        <div className="col-md-10">
                            <input className="form-control" type="text" ref="wordInput"  />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-md-2">Syllables</label>
                        <div className="col-md-10">
                            <input className="form-control" type="text" ref="syllables"  />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-md-2">image location</label>
                        <div className="col-md-10">
                            <input className="form-control" type="text" ref="location"  />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-md-2">search term</label>
                        <div className="col-md-10">
                            <input className="form-control" type="text" ref="searchTerm"  />
                        </div>
                    </div>

                    <div className="col-md-12">
                        <button className="btn -btn-primary" onClick={this.addWord.bind(this)}>Add</button>
                    </div>
                    <div className="form-group">
                        <label className="col-md-2">Selected Words</label>
                        <div className="col-md-12">
                            <ul className="list-inline">
                                {items}
                            </ul>

                        </div>
                    </div>
                </div>
               );
    }
}
