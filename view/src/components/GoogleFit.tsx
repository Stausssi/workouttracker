import React, {Component} from "react";


export default class GoogleFit  extends Component<{}> {
    constructor(props: any) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        fetch('http://localhost:3001/googlefit/getURLTing', {
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' +
                response.status);
              return;
            }
            // Examine the text in the response
            response.json().then((data) => {
                window.location =data.url;
            });
          });
    }
   
    render(){
        return (
            <div className="section">
                <div className="container">
                    <button type='submit' className='input is-black is-outlined' onClick={this.handleSubmit}>Import Data from GoogleFit</button>
                </div>
            </div>
        )
    }
}
