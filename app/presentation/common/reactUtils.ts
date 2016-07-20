let RDOM = IO.of(ReactDOM)

let keyed = (function() {
    var key = 0;
    return function(props) {
     
      props.key = ++key;
      return props; 
    };
})(); 

const addToComponentList = _.flowRight(addToArray,  makeComponent);

const makeComponent = (props, comp) => {
  return comp(keyed(props)); 
}; 

let makeWithChildren = _.curry( (component, children) => makeComponent( {children}, component) );
