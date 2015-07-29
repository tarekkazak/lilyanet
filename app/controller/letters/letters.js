var _ = require('lodash'),
    IO_EVENT = require('./app/common/events'),
    React = require('react'),
    Word = require('./public/js/components/word.jsx');

module.exports = function Letters(io){
        var lettersForWord = [],
        singleLetter = '';

    var WordFac = React.createFactory(Word);
    this.routes : [
            {
                path : '/letter',
                get : (req, res) => {
                    var content = React.renderToString(WordFac({letters : [singleLetter]}));
                    res.render('index', {
                        content : content
                    })
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
                get : (req, res) => {
                    res.send(template({'response' : lettersForWord.join(' ')}));
                }
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
