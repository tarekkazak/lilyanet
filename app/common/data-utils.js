const Utils = require('./utils');
const R = require('ramda');
const Future = require('ramda-fantasy').Future;
const Either = require('ramda-fantasy').Either;
export let get = R.curry( (fetch, url) => {
    return new Future((reject, resolve) => {
        return fetch(url).then((response) => {
            console.log(response.json);
            return response.json();
        }).then((data) => {
            resolve(data);
        }).catch(reject);
    });
});

export let extractData = R.curry((field, data) => {
    return data[field] ? Either.Right(data[field]) : Either.Left('Data has no playlists');
});

export let extractErrors = R.curry((dataType, data) => {
    let pullErrors = R.pipe(R.map( R.filter((either) => either.isLeft) ), R.map( R.map( (x) => x.toString() )), R.chain(R.identity), Utils.log(dataType));
     pullErrors(data);
     return data;
});

let validator = R.curry((prop, either) => {
    if(either instanceof Either === false) {
        either = Either.Right(either);
    }
    return either.isRight ? either.chain((item) => {
        return R.has(prop, item) ? Either.Right(item) : Either.Left([ `${prop} is missing` ]);
    }) : either.chain((item) => {
        return R.has(prop, item) ? either : either.map((x) =>  x.push(`${prop} is missing`))
    });
});

export let validateData = R.curry((requiredFields, data) => {
    let validators = R.pipe.apply(R, R.map((key) => validator(key), requiredFields));
    return validators(data);
});

export let extractValidItems = (container) => container.map(R.filter((either) => either.isRight)); 

export let stringMatchFilter = R.curry((prop, filterString) => {
    return (item) => item.chain( (val) => val[prop].indexOf(filterString) !== -1 );
}); 

export let valueMatchFilter = R.curry((prop, value) => {
    return (item) => item.chain( (val) => val[prop] === value );
}); 

export let filterResults = R.curry((predicate, container) => {
    return container.map(R.filter(predicate));
});
export let processSearchResults = R.curry((datakey, validator) => {
   return R.pipe( 
            extractData(datakey),
            R.map(validator),
            extractErrors(`prop errors, checking for ${[datakey]}::`),
            extractValidItems
            )
});

export let getListItem = R.pipe(R.chain(R.identity), R.nth(0), R.chain(R.identity));
