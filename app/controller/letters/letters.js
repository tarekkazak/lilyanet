import { DataModel } from '../../../public/js/model/dataModel.js';
var _ = require('lodash'),
    IO_EVENT = require('../../common/events').ioEvents,
    React = require('react/addons'),
    Word = require('../../../public/js/components/word.jsx'),
    LetterGenerator = require('../../service/letterGeneratorService.js').LetterGenerator;

module.exports = function Letters(io){
    var WordFac = React.createFactory(Word), 
        isSlideshow,
        connectionsMap = new WeakMap();

    function defaultRender(req, res) {
        var content = React.renderToString(WordFac({
            letters : model.letters,
            words : model.allowedWords,
            isLocalResource : false
        }));

        res.render('index', {
            content : content,
            word : '',
            isLocalResource : false,
            socketServer : process.env.SOCKET_SERVER
        });
    }
    
    io.on('connection', (socket) => {
        console.log('connected', socket.id);
        if(isSlideshow) {
            connectionsMap.set(socket, new LetterGenerator(model, io, socket));
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
                        words : model.allowedWords,
                        isLocalResource : isLocalResource
                    }));

                    res.render('index', {
                        content : content,
                        word : model.letters.join(''),
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
        ]
};
