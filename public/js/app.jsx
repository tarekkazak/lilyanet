var React = require('react/addons');
var Word = require('components/word.jsx');
var letters : [{id : 1, character : 'A'}],
React.render(<Word  letters={letters}/>, document.getElementById('ctt'));
