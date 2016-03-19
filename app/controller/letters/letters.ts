/// <reference path="../../../typings/tsd.d.ts" />
import {appContainer} from '../../common/appContainer';
import {_} from 'lodash';
import {IOEvents as IO_EVENT} from '../../common/events';
import {LetterGenerator} from'../../service/letterGeneratorService';
var React = require('react/addons');

export class LetterController {
    constructor(io) {
        this.init(io);
    }

    init(io) {
        let isSlideshow,
            model = appContainer.model,
            mode = '',
            connectionsMap = new WeakMap();

        function defaultRender(req, res) {

            res.render('index', {
                source : process.env.ENVIRONMENT === 'DEV' ? 'lilyanet.js' : 'lilyanet.min.js',
                socketServer : process.env.SOCKET_SERVER
            });
        }
    
        io.on('connection', (socket) => {
            console.log('connected', socket.id);
            if(isSlideshow) {
                connectionsMap.set(socket, new LetterGenerator(model, io, socket, mode).init());
            }

            socket.on('disconnect', () => {
                console.log('disconnected', socket.id);
                connectionsMap.delete(socket);
            });
        });

        this.routes = [
                {
                    path : '/',
                    get : defaultRender
                },
                {
                    path : '/slideshow',
                    get : (req, res) => {
                        isSlideshow = true;
                        mode = 'default';
                        defaultRender(req, res);
                    }
                },
                {
                    path : '/slideshow/syllables',
                    get : (req, res) => {
                        isSlideshow = true;
                        mode = 'syllables';
                        defaultRender(req, res);
                    }
                },
                {
                    path : '/letter',
                    get : [
                        (req, res, next) => {
                            //before processing next request, check if word is already complete
                            if(model.wordComplete()) {
                                model.resetWord();
                            }
                            next();
                    }, (req, res) => {
                        var content,
                            isLocalResource = false;
                        model.letters.push(req.query.letter);

                        console.log(req.query);
                        
                        isLocalResource = model.isResourceLocal();
                        //console.log('letters', model.letters);
                        console.log('is local resource', isLocalResource);

                    }]
                },
                {
                    path: '/letter/:letter',
                    post : (req, res) => {
                        var letterData = req.body,
                            letter = letterData.case === 'upper' ? letterData.character.toUpperCase() :  letterData.character;
                        if(letter.first) {
                            lettersForWord = [];
                        }
                        lettersForWord.push(letter);
                        io.emit(IO_EVENT.WORD_UPDATED);
                    }
                }
            ];
    }


}
