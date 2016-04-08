var monads = require('folktale/control').monads;
var Maybe = require('folktale/data').Maybe;
import React = require('react');
import ReactDOM = require('react-dom');
import { Signal } from 'signals';

export class WordSelector extends React.Component<any, any> {
    
    public addWordSignal:Signal;
    public selectWordSignal:Signal;
    public deleteWordSignal:Signal;
    public updateWordSignal:Signal;
    public refs;
    private wordSelectedForEditing;
    private tagSelector:any;

    constructor(props) {
        super(props);
        this.state = {
            words : [],
            editMode : false,
            searchImages : [],
            selectedImages : []
        };
        this.onSelectWord = this.onSelectWord.bind(this);
        this.deleteWord = this.deleteWord.bind(this);
        this.onEditWord = this.onEditWord.bind(this);
        this.onSearchTermChange = this.onSearchTermChange.bind(this);
        this.onSelectImage = this.onSelectImage.bind(this);
        this.updateWord = this.updateWord.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
    }

    componentDidMount() {

        this.tagSelector = $(ReactDOM.findDOMNode(this.refs.tags)).selectize({
            plugins : ['remove_button'],
            delimiter : ',',
            create : (input) => {
                return {
                    text : input,
                    value: input
                }
            }

        })[0].selectize;
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

    onSelectImage(e) {
        let imageObj = this.getImageObject($(e.target).attr('src'));
        this.setState({selectedImages : this.state.selectedImages.concat([imageObj])});
    }

    updateWord(e) {
        this.wordSelectedForEditing.value = (ReactDOM.findDOMNode(this.refs.wordInput) as HTMLInputElement).value;
        this.wordSelectedForEditing.searchTerm = (ReactDOM.findDOMNode(this.refs.searchTerm) as HTMLInputElement).value;
        this.wordSelectedForEditing.tags = (ReactDOM.findDOMNode(this.refs.tags) as HTMLInputElement).value.split(',');
        this.wordSelectedForEditing.syllables = (ReactDOM.findDOMNode(this.refs.syllables) as HTMLInputElement).value.split(',');
        this.wordSelectedForEditing.images = this.state.selectedImages;
        this.updateWordSignal.dispatch(this.wordSelectedForEditing);
        this.wordSelectedForEditing = undefined;
        this.setState({editMode : false});
    }

    onSearchTermChange(e) {
        let term = (ReactDOM.findDOMNode(this.refs.searchTerm) as HTMLInputElement).value;
        let query =`https://www.googleapis.com/customsearch/v1?key=AIzaSyB8CHLzyq52zdN33jnkuUAfqyp4GbBVzxU&cx=003704182668535555907:clqfeypkaeo&q=${term}&searchType=image&num=10`;

        $.get(query).then((data) => {
            console.log(data);
            this.setState({searchImages : data.items});
       });
    }

    onEditWord(e) {
        e.preventDefault();
        e.stopPropagation();
        let id = this.getWordId(e.target);
        let word = this.state.words.filter((item) => item._id === id)[0];
        (ReactDOM.findDOMNode(this.refs.wordInput) as HTMLInputElement).value = word.value;
        (ReactDOM.findDOMNode(this.refs.searchTerm) as HTMLInputElement).value = word.searchTerm;
        this.tagSelector.clearOptions();
        word.tags.map((item) => this.tagSelector.createItem(item));
        (ReactDOM.findDOMNode(this.refs.syllables) as HTMLInputElement).value = word.syllables.join(',');
        this.setState({editMode: true, selectedImages : word.images});
        this.wordSelectedForEditing = word;
        this.onSearchTermChange(null);
    }

    deleteWord(e) {
        e.preventDefault();
        e.stopPropagation();
        let id = this.getWordId(e.target);
        let word = this.state.words.filter((item) => item._id === id)[0]
        this.deleteWordSignal.dispatch(word);
    }

    deleteImage(e) {
        this.setState({selectedImages : this.state.selectedImages.filter((item) => item.link !== $(e.target).prev().attr('src'))})
    }

    addWord(e) {
        let word = {
           value : (ReactDOM.findDOMNode(this.refs.wordInput) as HTMLInputElement).value,
           searchTerm : (ReactDOM.findDOMNode(this.refs.searchTerm) as HTMLInputElement).value,
           images : this.state.selectedImages,
           tags : this.tagSelector.items,
           syllables : (ReactDOM.findDOMNode(this.refs.syllables) as HTMLInputElement).value.split(',')
        };

        this.addWordSignal.dispatch(word);
    }

    private getWordId(element) {
        return $(element).is('[data-model]') ? $(element).attr('data-model') : $(element).closest('[data-model]').attr('data-model'); 
    }

    render() {
        let selectedImages = this.state.selectedImages.map((item, index) => (
            <li key={index} >
                <img className="media-object" src={item.link} width="20" height="20"/>
                <button  type="button" onClick={this.deleteImage} className="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            </li>)
        );
        let images = this.state.searchImages.map((item, index) => (
            <li key={index} >
                <img className="media-object" onClick={this.onSelectImage}  src={item.image.thumbnailLink} width={item.image.thumbnailWidth} height={item.image.thumbnailHeight} />
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
                        <label className="col-md-2">images</label>
                        <div className="col-md-10">
                            <ul className="list-inline">{selectedImages} </ul>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-md-2">tags</label>
                        <div className="col-md-10">
                            <input className="form-control" type="text" ref="tags"  />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-md-2">search term</label>
                        <div className="col-md-10">
                            <input onChange={this.onSearchTermChange} className="form-control" type="text" ref="searchTerm"  />
                        </div>
                    </div>

                    <div className="col-md-12">
                        <button className="btn btn-primary" disabled={!this.state.editMode} onClick={this.updateWord.bind(this)}>Update</button>
                        <button className="btn btn-success" disabled={this.state.editMode} onClick={this.addWord.bind(this)}>Add</button>
                    </div>
                    <div className="form-group">
                        <label className="col-md-2">Selected Words</label>
                        <div className="col-md-12">
                            <ul  className="word-selector-word-list list-inline">
                                {items}
                            </ul>
                            <ul  className=" list-inline">
                                {images}
                            </ul>

                        </div>
                    </div>
                </div>
               );
    }
}
