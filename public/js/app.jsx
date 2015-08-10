var React = require('react/addons');
var Word = require('./components/word.jsx');
var model = require('./model/dataModel.js');
console.log('app', model.allowedWords);
React.render(<Word isLocalResource={window.isLocalResource} words={model.allowedWords}  letters={window.letters}/>, document.getElementById('container'));
