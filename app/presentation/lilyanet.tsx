declare var container:any;
var io = require('socket.io-client')
var socket = io(container.socketServer);

import {registerSocket} from '../common/appContainer';
registerSocket(socket);

import {IOEvents as IO_EVENT} from '../common/events';
import {Word} from './components/word';
import {WordMediator} from './mediators/wordMediator';

import {ImageLoader} from './components/imageLoader';
import {ImageLoaderMediator} from './mediators/imageLoaderMediator';

import {WordSelector} from './components/wordSelector';
import {WordSelectorMediator} from './mediators/wordSelectorMediator';


import React = require('react');
import ReactDOM = require('react-dom');

let wordComp = ReactDOM.render(<Word />, document.getElementById('word-container'),function() {
    let wordMediator = new WordMediator(this);
    socket.emit(IO_EVENT.RENDER_COMPLETE);
});

let imageLoader = ReactDOM.render(<ImageLoader />, document.getElementById('image-container'),function()  {
    let imageLoaderMediator = new ImageLoaderMediator(this);
});

let wordSelector = ReactDOM.render(<WordSelector />, document.getElementById('word-selector-container'), function() {
    let wordSelectorMediator = new WordSelectorMediator(this);
});

