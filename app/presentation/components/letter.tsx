import React = require('react');

export class Letter extends React.Component<any,any> {
    constructor(props) {
        super(props);
    }

    render()  {
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
}

