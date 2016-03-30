/// <reference path="../../../../typings/tsd.d.ts" />
import _ =  require('lodash');
import {IOEvents as IO_EVENT} from '../../../common/events';
import {init} from '../../../common/appContainer';

export class LetterController {
    
    public routes;

    constructor(io) {
        this.init(io);
    }

    init(io) {
        let isSlideshow,
            mode = '',
            connectionsMap = new WeakMap();

        function defaultRender(req, res) {

            res.render('index', {
                source : process.env.ENVIRONMENT === 'DEV' ? 'lilyanet.js' : 'lilyanet.min.js',
                socketServer : process.env.SOCKET_SERVER
            });
        }
    
        io.on('connection', (socket) => {
            console.log('socket connected', socket.id);
            if(isSlideshow) {
                connectionsMap.set(socket, init(socket, io, mode));
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
                            next();
                    }, (req, res) => {
                        var content,
                            isLocalResource = false;

                        console.log(req.query);
                        console.log('is local resource', isLocalResource);

                    }]
                },
                {
                    path: '/letter/:letter',
                    post : (req, res) => {
                        var letterData = req.body,
                            letter = letterData.case === 'upper' ? letterData.character.toUpperCase() :  letterData.character;
                        io.emit(IO_EVENT.WORD_UPDATED);
                    }
                }
            ];
    }


}
