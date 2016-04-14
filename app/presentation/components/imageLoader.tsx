import React  = require('react');
import _ =  require('lodash');

export class ImageLoader extends React.Component<any,any> {

    constructor(props) {
        super(props)
        this.state = {
            images : []
        };

    }

    render() {
        let images = _.map(this.state.images, (item:any) =>{
            return (
                    <img key={item.link}width="200" height="200" src={item.link} />
                   );
        });
        let style = {
            visibility : this.state.images.length > 0 ? 'visible' : 'hidden'
        };
        return (
                <div style={style}>{images}</div>
               );
        
    }
}
