var React = require('react/addons');

var Letter = React.createClass({
    render : () => {
        var letterStyle = {
            color : this.props.color,
            marginRight : '6px',
            fontSize : '40px',
            fontWeight : 'bold'
        };
        return (
                <span style={letterStyle}>{this.props.character}</span>
               );
    }
});

module.exports = Letter;
