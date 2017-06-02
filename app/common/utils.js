const R = require('ramda');
export let trace = R.curry((debug, title, data) => {
    if(debug) {
        console.log(title, data);
    }
    return data;
});



export let log = trace(true);
