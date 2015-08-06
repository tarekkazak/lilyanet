var React = require('react/addons');
var Word = require('./components/word.jsx');


React.render(<Word letters={window.letters}/>, document.getElementById('container'));
