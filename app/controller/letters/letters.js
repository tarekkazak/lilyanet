import {appContainer} from '../../common/appContainer.js';
import {Word} from '../../components/word.jsx';
import {_} from 'lodash';
import {ioEvents as IO_EVENT} from '../../common/events.js';
import {LetterGenerator} from'../../service/letterGeneratorService.js';
var React = require('react/addons');

export class LetterController {
    constructor(io) {
        this.init(io);
    }

    init(io) {
        var WordFac = React.createFactory(Word), 
            isSlideshow,
            model = appContainer.model,
            mode = '',
            connectionsMap = new WeakMap();

        function defaultRender(req, res) {
            var content = React.renderToString(WordFac({
                letters : model.letters,
                words : model.getWords(),
                isLocalResource : false
            }));

            res.render('index', {
                content : content,
                word : '',
                isLocalResource : false,
                source : process.env.ENVIRONMENT === 'DEV' ? 'bundle.js' : 'bundle.min.js',
                socketServer : process.env.SOCKET_SERVER
            });
        }
    
        io.on('connection', (socket) => {
            console.log('connected', socket.id);
            if(isSlideshow) {
                connectionsMap.set(socket, new LetterGenerator(model, io, socket, mode));
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

                        content = React.renderToString(WordFac({
                            letters : model.letters,
                            words : model.getWords(),
                            isLocalResource : isLocalResource
                        }));

                        res.render('index', {
                            content : content,
                            word : model.letters.join(''),
                            source : process.env.ENVIRONMENT === 'DEV' ? 'bundle.js' : 'bundle.min.js',
                            isLocalResource : isLocalResource
                        });
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
