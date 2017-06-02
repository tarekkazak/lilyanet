import * as R from'ramda';
import * as RenderUtils from '../common/react-utils';
import * as DataUtils  from'../../common/data-utils';
import * as Utils from '../../common/utils';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {Maybe} from 'ramda-fantasy';
import { Item, LabelGroup, Icon, Label, Header } from 'semantic-ui-react';
import {selectedPlaylistSignal} from './signals';

let validateWords = R.map(DataUtils.validateData(['word']));
let createItemProps = (playlist) =>  {
    return {
        content : playlist.content.chain((words) => {
            return RenderUtils.getNewReactComponentWithChildren(LabelGroup, {},  
                words.map((word) => word.chain((w) => {
                    return RenderUtils.getNewReactComponent(Label, {
                            key : w.id, 
                            image : '/assets/images/avatar/small/ade.jpg',
                            content : w.word,
                            onRemove : (e, data) => {
                                playlist.words = R.remove(R.findIndex( (x) => x === w.id, playlist.words), 1, playlist.words);
                                selectedPlaylistSignal.dispatch(playlist);
                            }
                        });

                    } ) )
                 ); 
            }
        ),
        header : RenderUtils.getNewReactComponent(Header, {as:'h2', content : playlist.title}),
        description : playlist.description
    };
};



selectedPlaylistSignal.add((playlist) => {
        Utils.log('selected playlist', playlist);
        DataUtils.get(fetch, 'test_data/words.json')
            .map(DataUtils.processSearchResults('words', validateWords))
            .map(Utils.log('words of playlist'))
            .map(DataUtils.filterResults( (item) => item.chain( (word) => R.any((id) =>  id === word.id, playlist.words) )) )
            .fork(
                Utils.log('selected playlist error'),
                (words) => {
                    playlist.content = words;
                    RenderUtils.createReactComponent(Maybe.of(Item), Maybe.of(createItemProps(playlist)) )
                        .map(
                                (el) => {
                                    RenderUtils.render(ReactDOM, el, document.getElementById('playlistEditor'));
                                }
                             );
                }
            );
    }
);
