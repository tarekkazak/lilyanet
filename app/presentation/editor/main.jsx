import './playlist-editor';
import {init as playlistSearchInit} from'./playlist-search';
import {init as wordSearchInit} from'./word-search';
import * as RenderUtils from '../common/react-utils';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {Maybe} from 'ramda-fantasy';
import { Grid } from 'semantic-ui-react';


const EditorGrid = () => (
    <Grid celled="internally">
       <Grid.Row> 
            <Grid.Column width={3}>
                <div id="playlistSearch" />
            </Grid.Column>
            <Grid.Column width={10}>
                <div id="wordSearch" />
            </Grid.Column>
            <Grid.Column width={3}>
                <div  />
            </Grid.Column>
       </Grid.Row> 
       <Grid.Row> 
            <Grid.Column width={3}>
                <div id="playlistEditor" />
            </Grid.Column>
            <Grid.Column width={10}>
                <div id="wordEditor" />
            </Grid.Column>
            <Grid.Column width={3} >
                <div id="wordView" />
            </Grid.Column>
       </Grid.Row> 
    </Grid>
)

RenderUtils.createComponent(Maybe.of(React), Maybe.of(EditorGrid), Maybe.of({}))
    .map(
            (el) => {
                RenderUtils.render(ReactDOM, el, document.getElementById('container'));
                playlistSearchInit();
            }
         );
