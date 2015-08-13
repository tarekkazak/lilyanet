var React = require('react/addons');
var Word = require('./components/word.jsx');
var model = require('./model/dataModel.js');
var index = 0;
var l = window.letters;

var wordComp = React.render(<Word isLocalResource={window.isLocalResource} words={model.allowedWords}  letters={l}/>, document.getElementById('container'));

function initView() {
    l = model.allowedWords[index].toUpperCase().split('');
    model.letters = l;
    wordComp.setState({
        letters : l,
        words : model.allowedWords,
        isLocalResource : model.isResourceLocal()
    });
    index++;
    if(index === model.allowedWords.length) {
        index = 0;
    }
}

setInterval(initView, 10000);
