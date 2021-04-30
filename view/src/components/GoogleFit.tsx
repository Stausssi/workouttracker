import React, {Component} from "react";
import SessionHandler from "../utilities/SessionHandler";
import {BACKEND_URL} from "../App";

//google fit import button
export default class GoogleFit extends Component<{}> {
    private readonly abortController: AbortController;

    constructor(props: any) {
        super(props);

        this.abortController = new AbortController();

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        //get url to redirect
        fetch(BACKEND_URL + 'googlefit/getURLTing', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: SessionHandler.getAuthToken()
            },
            signal: this.abortController.signal
        }).then((response) => {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }
            // Examine the text in the response
            response.json().then((data) => {
                window.location = data.url;//redirect to generated google url with all permissions tokens etc.
            });
        }).catch((error: any) => {
            if (error.name !== "AbortError") {
                console.log("Fetch failed:", error);
            }
        });
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    render() {
        return (
            <div className="container">
                <button type='submit' className='button is-black is-outlined' onClick={this.handleSubmit}>
                    Import Data from GoogleFit
                </button>
            </div>
        )
    }
}
