var monads = require('folktale/control').monads;
var Maybe = require('folktale/data').Maybe;
import React = require('react');
import ReactDOM = require('react-dom');
var _ = require('lodash');
import {TagSelector} from './tagSelector';
import {ImageSelector} from './imageSelector';
import { Signal } from 'signals';
import {WordDependentMediator} from '../mediators/wordDependentMediator';
import {WordCreateUpdateDeleteMediator} from '../mediators/wordCreateUpdateDeleteMediator';
import {mediate} from '../mediators/abstractMediator';

    const FormGroup = (props) => {
        return(
              <div className="form-group">
                  <label className="col-md-2">{props.label}</label>
                  <div className={"col-md-" + props.colWidth}>
                      {props.children}
                  </div>
              </div>

              );
    };

    const trace = (message) => (input) => { 
        console.log(message, input) ;
        return input;
    };

    const Col = (props) => <div className={"col-md-" + props.colWidth}>{props.children}</div>;
    const Row = (props) => <div className="row"> {props.children} </div>;

    const wordValueFormItem = (props) => {
        return (
            <div className="form-horizontal">
                <FormGroup label="Add word" colWidth="10"  >
                    <input className="form-control" value={props.wordValue}  type="text" ref="wordInput"  />
                </FormGroup>
                
                {props.tagSelector}
            </div>

         );
    };

    const syllablesFormItem = (props) => {
        return (
            <div className="form-horizontal">
                <FormGroup label="Syllables" colWidth="10"  >
                    <input className="form-control" type="text" ref="syllables" value={props.syllables}  />
                </FormGroup>
            </div>   

        );
    };

    const selectedImagesFormItem = (props) => {
        return (

            <FormGroup label="Images" colWidth="10" >
                    <ul className="list-inline">{props.selectedImages} </ul>
                    <button  type="button" onClick={props.deleteAllImages} className="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </FormGroup>
            );
        };

@mediate(WordDependentMediator, WordCreateUpdateDeleteMediator)
export class WordSelector extends React.Component<any, any> {
    
    public addWordSignal:Signal;
    public selectWordSignal:Signal;
    public deleteWordSignal:Signal;
    public updateWordSignal:Signal;

    public refs;
    private wordSelectedForEditing;
    private tagSelector;
    private imageSelector;


    constructor(props) {
        super(props);
        this.state = {
            words : [],
            wordToEdit : {},
            editMode : false,
            selectedImages : []
        };
        this.onSelectWord = this.onSelectWord.bind(this);
        this.deleteWord = this.deleteWord.bind(this);
        this.onEditWord = this.onEditWord.bind(this);
        this.updateWord = this.updateWord.bind(this);
        this.addWord = this.addWord.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
        this.deleteAllImages = this.deleteAllImages.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
    }

    componentDidMount() {
        this.tagSelector = <TagSelector />;    
        this.imageSelector = <ImageSelector />;    
    }

    onSelectWord(e) {
        e.preventDefault();
        e.stopPropagation();
        let id = this.getWordId(e.target);
        let word = this.state.words.filter((item) => item._id === id)[0]
        this.selectWordSignal.dispatch(word);
    }

    private getImageObject(url) {
        return this.state.searchImages.filter((item) => item.image.thumbnailLink === url)[0];
    }

    updateWord(e) {
        this.wordSelectedForEditing.value = (ReactDOM.findDOMNode(this.refs.wordInput) as HTMLInputElement).value;
        this.wordSelectedForEditing.searchTerm = (ReactDOM.findDOMNode(this.refs.searchTerm) as HTMLInputElement).value;
        this.wordSelectedForEditing.tags = this.tagSelector.getItems();
        this.wordSelectedForEditing.syllables = (ReactDOM.findDOMNode(this.refs.syllables) as HTMLInputElement).value.split(',');
        this.wordSelectedForEditing.images = this.state.selectedImages;
        this.updateWordSignal.dispatch(this.wordSelectedForEditing);
        this.wordSelectedForEditing = undefined;
        this.clearForm();

    }

    private clearForm() {
        this.setState({editMode : false,  searchImages : [], selectedImages : [], wordToEdit : null});
    }

    onEditWord(e) {
        e.preventDefault();
        e.stopPropagation();
        let id = this.getWordId(e.target);
        let word = this.state.words.filter((item) => item._id === id)[0];

        //gTthis.tagSelector.createItem(item));
        this.setState({editMode: true, selectedImages : word.images, wordToEdit : word});
        this.wordSelectedForEditing = word;
        let input = (ReactDOM.findDOMNode(this.refs.searchTerm) as HTMLInputElement);
        input.value = word.searchTerm;
        $(input).trigger('change');
    }

    cancelEdit(e) {
        this.setState({editMode : false, wordToEdit : null});
    }

    deleteWord(e) {
        e.preventDefault();
        e.stopPropagation();
        let id = this.getWordId(e.target);
        let word = this.state.words.filter((item) => item._id === id)[0]
        this.deleteWordSignal.dispatch(word);
    }

    deleteAllImages(e) {
        this.setState({selectedImages : []});
    }

    deleteImage(e) {
        this.setState({selectedImages : this.state.selectedImages.filter((item) => item.image.thumbnailLink !== $(e.currentTarget).prev().attr('src'))})
    }

    addWord(e) {
        let word = {
           value : (ReactDOM.findDOMNode(this.refs.wordInput) as HTMLInputElement).value,
           searchTerm : (ReactDOM.findDOMNode(this.refs.searchTerm) as HTMLInputElement).value,
           images : this.state.selectedImages,
           tags : this.tagSelector.getItems(),
           syllables : (ReactDOM.findDOMNode(this.refs.syllables) as HTMLInputElement).value.split(',')
        };

        this.addWordSignal.dispatch(word);
        this.clearForm();
    }

    private getWordId(element) {
        return $(element).is('[data-model]') ? $(element).attr('data-model') : $(element).closest('[data-model]').attr('data-model'); 
    }

    render() {
        let selectedImages = this.state.selectedImages.map((item, index) => (
            <li key={index} >
                <img className="media-object" src={item.image.thumbnailLink} width="40" height="40"/>
                <button  type="button" onClick={this.deleteImage} className="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </li>)
        );

        let items = this.state.words.map((word) => (
            <li key={word._id} >
                <label className={ word.selected ? 'btn btn-primary' : 'btn btn-default' } onClick={this.onSelectWord} data-model={word._id}>
                    {word.value}
                    <i className="glyphicon glyphicon-edit" onClick={this.onEditWord}></i>
                    <button  type="button" onClick={this.deleteWord} className="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </label>
            </li>)
        );


        let makeChild = (...components) => ({children : components});
        //let makeChildOfCol = _.compose((props) => props , makeChild)

        let makeWord = _.compose(trace('col'),  Col, trace('children made'), makeChild, trace('word value'),  wordValueFormItem );
        let makeSyllables = _.compose(  Col, makeChild,  syllablesFormItem );
        let makeSelectedImages = _.compose(  Col, makeChild,  selectedImagesFormItem );
        let firstRow = _.compose(Row, makeChild, () => [makeWord({wordValue : this.state.wordToEdit.value, tagSelector : this.tagSelector}), makeSyllables({syllables : this.state.wordToEdit.syllables})]);
        let secondRow = _.compose(Row, makeChild, () => makeSelectedImages({selectedImages, deleteAllImages : this.deleteAllImages}));
        return (
                <div>

                    {firstRow()}
                    {secondRow()}
                    
                    <div className="row">
                        <div className="form-horizontal">
                            {this.imageSelector}


                            <FormGroup label="Images" colWidth="10" >
                                    <ul  className="word-selector-word-list list-inline">
                                        {items}
                                    </ul>

                            </FormGroup>
                        </div>

                        <div className="col-md-12">

                            <div className="pull-right">
                                <button className="btn btn-primary" disabled={!this.state.editMode} onClick={this.updateWord}>Update</button>
                                <button className="btn btn-success" disabled={this.state.editMode} onClick={this.addWord}>Add</button>
                                <button className="btn btn-default" disabled={!this.state.editMode} onClick={this.cancelEdit}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
               );
    }
}
