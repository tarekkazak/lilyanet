require('isomorphic-fetch');
import * as R from'ramda';
import * as Utils from '../../common/utils';
import { Search } from 'semantic-ui-react';
import * as DataUtils  from'../../common/data-utils';
import * as RenderUtils from '../common/react-utils';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {Maybe} from 'ramda-fantasy';
import {Either} from 'ramda-fantasy';
import {Future} from 'ramda-fantasy';
import { Grid } from 'semantic-ui-react';
import {selectedWordSignal} from './signals';

let createSearchProps = R.curry((config, container) =>  {
    return {
        onSearchChange : onSearchChange,
        onResultSelect : onResultSelect,
        results : Either.either(() => [],  R.map( (item) =>  item.chain( (item) => ( { key : item.id, title : item.title } )) ), container),
        open:true,
        noResultsMessage : Either.either(R.identity, () => 'No results found', container),
        value : config.value
    };
} );

let validateWord = R.map(DataUtils.validateData(['word']));

let updateSearchWord = (config) => {

    let buildResultsListAndComponentProps = R.pipe(DataUtils.processSearchResults('words', validateWord),
                                                    //TODO: implement multi-prop search 'tag'
                                                    DataUtils.filterResults(DataUtils.stringMatchFilter('word', config.value) ), 
                                                    createSearchProps(config));
    RenderUtils.createReactComponent(
                Future.of(Search), 
                DataUtils.get(fetch, 'test_data/words.json').map(buildResultsListAndComponentProps) 
            ).fork(
                Utils.log( 'booooo'),
                (el) => {
                    Utils.log('result', el);
                    RenderUtils.render(ReactDOM, el, document.getElementById('wordSearch'));
                }
             );
};
//event handlers
let onResultSelect =  (ev, obj) => {
        DataUtils.get(fetch, 'test_data/words.json')
            .map(DataUtils.processSearchResults('words', validateWord))
            .map(DataUtils.filterResults(DataUtils.valueMatchFilter('id', obj.key)))
            .fork(
                Utils.log( 'error'),
                (word) => {
                    //TODO move into utils
                    let getWord = R.pipe(R.chain(R.identity), R.nth(0), R.chain(R.identity));
                    word = getWord(word);
                    selectedWordSignal.dispatch(word);
                    updateSearchWord({open:false, value:''})
                }
        );
};
let onSearchChange = R.pipe(
        (ev, val) => ( {open : true, value : val} ),
        updateSearchWord
);

//init
export function init() {
    RenderUtils.createReactComponent(Maybe.of(Search), Maybe.of({onSearchChange : onSearchChange}))
        .map(
                (el) => {
                    RenderUtils.render(ReactDOM, el, document.getElementById('wordSearch'));
                }
             );
}
