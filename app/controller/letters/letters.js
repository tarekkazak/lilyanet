var _ = require('lodash'),
    IO_EVENT = require('../../common/events'),
    React = require('react/addons'),
    Word = require('../../../public/js/components/word.jsx'),
    model = require('../../../public/js/model/dataModel.js');

module.exports = function Letters(io){
    var WordFac = React.createFactory(Word);
    this.routes = [
            {
                path : '/',
                get : (req, res) => {
                    var content = React.renderToString(WordFac({
                        letters : model.letters
                    }));
                    res.render('index', {
                        content : content
                    })
                }
            },
            {
                path : '/letter',
                get : (req, res) => {
                    var content = React.renderToString(WordFac({
                        letters : [{id : 1, character : req.query.character}],
                        wordComplete : false
                    }));
                    res.render('index', {
                        content : content,
                        letters  : letters
                    });
                }
            },
            {
                path : '/:letter',
                post : (req, res) => {
                    var letterData = req.body,
                        letter = letterData.case === 'upper' ? letterData.character.toUpperCase() :  letterData.character;

                    singleLetter = letter;
                    io.emit(IO_EVENT.LETTER_UPDATED);
                }
            },
            {
                path : '/word',
                get : [
                    (req, res, next) => {
                        model.validateWord();
                        next();
                }, (req, res) => {
                    model.letters.push(req.query.word);
                    console.log(req.query);

                    var lettersForWord = _.map(model.letters, (item, index) => ({id:index, character:item}));

                    console.log('letters', model.letters);
                    console.log('lfw', lettersForWord);

                    var content = React.renderToString(WordFac({letters : lettersForWord}));
                    res.render('index', {
                        content : content,
                        word : model.letters.join('')
                    });
                }]
            },
            {
                path: '/word/:letter',
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
