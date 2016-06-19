var monads = require('folktale/control').monads;
var Maybe = require('folktale/data').Maybe;
import React = require('react');
import ReactDOM = require('react-dom');
import { Signal } from 'signals';
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

//@mediate(WordDependentMediator, WordCreateUpdateDeleteMediator)
export class ImageSelector extends React.Component<any, any> {
    
//    public addWordSignal:Signal;

    public refs;


    constructor(props) {
        super(props);
        this.state = {
            searchImages : []
        };
        this.onSearchTermChange = this.onSearchTermChange.bind(this);
        this.onSelectImage = this.onSelectImage.bind(this);
    }



    private getImageObject(url) {
        return this.state.searchImages.filter((item) => item.image.thumbnailLink === url)[0];
    }

    onSelectImage(e) {
        let imageObj = this.getImageObject($(e.target).attr('src'));
        this.setState({ selectedImages : this.state.selectedImages.concat([imageObj])});
    }


    onSearchTermChange(e) {
        let term = (ReactDOM.findDOMNode(this.refs.searchTerm) as HTMLInputElement).value;
        let query =`https://www.googleapis.com/customsearch/v1?key=AIzaSyB8CHLzyq52zdN33jnkuUAfqyp4GbBVzxU&cx=003704182668535555907:clqfeypkaeo&q=${term}&searchType=image&num=10`;

        $.get(query).then((data) => {
            console.log(data);
            this.setState({searchImages : data.items});
       });
    }

    render() {
        let images = this.state.searchImages.map((item, index) => (
            <li key={index} >
                <img className="media-object" onClick={this.onSelectImage}  src={item.image.thumbnailLink} width={item.image.thumbnailWidth} height={item.image.thumbnailHeight} />
            </li>)
        );


        return (
                <div>
                    <FormGroup label="Search term" colWidth="10" >
                        <input onChange={this.onSearchTermChange}  className="form-control" type="text" ref="searchTerm"  />
                    </FormGroup>

                    <ul  className=" list-inline">
                        {images}
                    </ul>

                </div>
               );
    }
}
