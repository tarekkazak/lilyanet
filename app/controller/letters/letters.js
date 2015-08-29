var _ = require('lodash'),
    IO_EVENT = require('../../common/events'),
    React = require('react/addons'),
    Word = require('../../../public/js/components/word.jsx'),
    model = require('../../../public/js/model/dataModel.js');

module.exports = function Letters(io){

    function* generateLetter(words) {
        for(let word of model.allowedWords) {
            for(let letter of word) {
                io.emit(IO_EVENT.LETTER_UPDATED, {letter : letter.toUpperCase()});
                yield letter;
            }
            setTimeout(() =>{
                if(gen.next().done) {
                    startGenerator();
                }        
            }, 5000);

            yield;
        }
    }

    function startGenerator() {
        console.log('start generation');
        gen = generateLetter(model.allowedWords);
        gen.next();
    }

    var gen, 
        WordFac = React.createFactory(Word);


    this.routes = [
            {
                path : '/',
                get : (req, res) => {
                    var content = React.renderToString(WordFac({
                        letters : model.letters,
                        words : model.allowedWords,
                        isLocalResource : false
                    }));

                    res.render('index', {
                        content : content,
                        word : '',
                        isLocalResource : false
                    });

                }
            },
            {
                path : '/slideshow',
                get : (req, res) => {
                    var ioConnectionPromise = new Promise((resolve, reject) => {
                        io.on('connection', (socket) => {

                            socket.on(IO_EVENT.RENDER_COMPLETE, () => {
                                console.log('first render');
                                resolve(socket);
                            });
                            console.log('connected');
                        });
                        
                    });

                    var content = React.renderToString(WordFac({
                        letters : model.letters,
                        words : model.allowedWords,
                        isLocalResource : false
                    }));

                    res.render('index', {
                        content : content,
                        word : '',
                        isLocalResource : false
                    });

                    ioConnectionPromise.then((socket) => {
                        socket.on(IO_EVENT.VIEW_UPDATED, () => {
                            console.log('view updated');
                            setTimeout(() => {
                                gen.next();
                           }, 1000); 
                        });

                        startGenerator();
                    });

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
