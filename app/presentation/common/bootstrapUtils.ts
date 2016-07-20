import * from 'reactUtils';
export const Form =  (props) => <div key={props.key} className="form-horizontal">{props.children}</div>;
export const Row =  (props) => <div key={props.key} className="row">{props.children}</div>;
export const Col =  (props) => <div key={props.key} className={"col-xs-" + props.colWidth}>{props.children}</div>;

const formGroup = (props) => {
    return (<div key={props.key} className="form-group">
              <label className="control-label col-xs-2">{props.label}</label>
              {col(props.colProps)}
              </div>);
  
};
 
let createColConfig = (colWidth, children) => chain(_.flowRight(setProp('children', children),
                                        trace('colWidth'),
                                        setProp('colWidth', colWidth)), Maybe.of({}));
                                        
let createFormConfig = (label, colWidth, children) => chain(_.flowRight( setProp('colProps', createColConfig(colWidth, children)),
                                                                         trace('label'),
                                                                         setProp('label', label)), Maybe.of({}));

