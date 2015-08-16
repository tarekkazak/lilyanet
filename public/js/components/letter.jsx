var React = require('react/addons');

var Letter = React.createClass({
    render :function()  {
        var letterStyle = {
            color : this.props.color,
            marginRight : '6px',
            display : 'inline-block',
            fontSize : '7.5em',
            fontWeight : 'bold'
        };
        return (
                <span style={letterStyle}>{this.props.character}</span>
               );
    }
});

module.exports = Letter;
