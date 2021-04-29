import React, {Component} from "react";
import SessionHandler from "../utilities/SessionHandler";
import {BACKEND_URL} from "../App";

//google fit import button
export default class GoogleFit  extends Component<{}> {
    constructor(props: any) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        //get url to redirect
        fetch(BACKEND_URL + 'googlefit/getURLTing', {
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: SessionHandler.getAuthToken() 
            },
        }).then((response) => {
            if (response.status !== 200) {
              console.log('Looks like there was a problem. Status Code: ' +
                response.status);
              return;
            }
            // Examine the text in the response
            response.json().then((data) => {
                window.location =data.url;//redirect to generated google url with all permissions tokens etc.
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
