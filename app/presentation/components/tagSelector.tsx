var monads = require('folktale/control').monads;
var Maybe = require('folktale/data').Maybe;
import React = require('react');
import ReactDOM = require('react-dom');
import { Signal } from 'signals';

import {TagDependentMediator} from '../mediators/tagDependentMediator';
import {TagCreateDeleteMediator} from '../mediators/tagCreateDeleteMediator';
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

@mediate(TagDependentMediator, TagCreateDeleteMediator)
export class TagSelector extends React.Component<any, any> {
    
    public addTagSignal:Signal;
    public deleteTagSignal:Signal;

    public refs;
    private tagSelector:any;

    constructor(props) {
        super(props);
        this.state = {
            tags : []
        };
    }


    componentDidMount() {

        this.tagSelector = $(ReactDOM.findDOMNode(this.refs.tags)).selectize({
            plugins : ['remove_button'],
            delimiter : ',',
            labelField : 'text',
            valueField : '_id',
            openOnFocus:false,
            options : this.state.tags,
            create : (input) => {
                var tag = {
                    text : input
                };

                this.addTagSignal.dispatch(tag);
                
            }

        })[0].selectize;
    }

    getItems() {
        return this.tagSelector.items;
    }


    render() {
        if(this.tagSelector) {
            this.tagSelector.addOption(this.state.tags);
        }


        return (
            <FormGroup label="tags"  colWidth="10" >
                <input className="form-control" type="text" ref="tags"  />
            </FormGroup>
               );
    }
}
