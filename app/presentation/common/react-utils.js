import * as React from 'react';
import * as R from'ramda';
import {Maybe} from 'ramda-fantasy';

const R = require('ramda');
let keyed = (function() {
    var key = 0;
    return function(props) {
     
      props.key = ++key;
      return props; 
    };
})(); 

export let render = R.curry((ReactDOM, element, container) => {
    ReactDOM.render(element, container);
});

export let createElement = (React, component, props) => {
    return React.createElement(component, props, null);
};

export let createElementWithChildren = (React, component, props, children) => {
    return React.createElement(component, props, children);
};

export let createComponent = R.liftN(3, createElement);

export let createComponentWithChildren = R.liftN(4, createElementWithChildren);

export let createReactComponent = createComponent(Maybe.of(React));

export let getNewReactComponent = (component, props) => {
    return createComponent(Maybe.of(React), Maybe.of(component), Maybe.of(props)).chain(R.identity);
};

export let getNewReactComponentWithChildren = (component, props, children) => {
    return createComponentWithChildren(Maybe.of(React), Maybe.of(component), Maybe.of(props), Maybe.of(children)).chain(R.identity);
};
