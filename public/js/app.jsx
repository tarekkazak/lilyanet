var React = require('react/addons');
var Word = require('./components/word.jsx');
var model = require('./model/dataModel.js');

React.render(<Word isLocalResource={window.isLocalResource} words={model.allowedWords}  letters={window.letters}/>, document.getElementById('container'));
