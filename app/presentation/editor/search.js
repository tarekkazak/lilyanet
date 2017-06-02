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
import {selectedPlaylistSignal} from './signals';

export class DataSearch {

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
}


let validatePlaylists = R.map(DataUtils.validateData(['title']));

let updateSearchPlaylist = (config) => {

    let buildResultsListAndComponentProps = R.pipe(DataUtils.processSearchResults('playlists', validatePlaylists),
                                                    DataUtils.filterResults(DataUtils.stringMatchFilter('title', config.value) ), 
                                                    createSearchProps(config));
    RenderUtils.createReactComponent(
                Future.of(Search), 
                DataUtils.get(fetch, 'test_data/playlists.json').map(buildResultsListAndComponentProps) 
            ).fork(
                Utils.log( 'booooo'),
                (el) => {
                    Utils.log('result', el);
                    RenderUtils.render(ReactDOM, el, document.getElementById('playlistSearch'));
                }
             );
};
//event handlers
let onResultSelect =  (ev, obj) => {
        DataUtils.get(fetch, 'test_data/playlists.json')
            .map(DataUtils.processSearchResults('playlists', validatePlaylists))
            .map(DataUtils.filterResults(DataUtils.valueMatchFilter('id', obj.key)))
            .fork(
                Utils.log( 'error'),
                (playlist) => {
                    let getPlaylist = R.pipe(R.chain(R.identity), R.nth(0), R.chain(R.identity));
                    playlist = getPlaylist(playlist);
                    Utils.log('playlist', playlist);
                    selectedPlaylistSignal.dispatch(playlist);
                    updateSearchPlaylist({open:false, value:''})
                }
        );
};
let onSearchChange = R.pipe(
        (ev, val) => ( {open : true, value : val} ),
        updateSearchPlaylist
);

//init
export function init() {
    RenderUtils.createReactComponent(Maybe.of(Search), Maybe.of({onSearchChange : onSearchChange}))
        .map(
                (el) => {
                    RenderUtils.render(ReactDOM, el, document.getElementById('playlistSearch'));
                }
             );
}
