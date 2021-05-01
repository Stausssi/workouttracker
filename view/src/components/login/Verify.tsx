import React from "react";
import {FRONTEND_URL} from "../../App";

interface State {
    progress: number
}

export default class Verify extends React.Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            progress: 0
        }
    }

    Sleep(milliseconds: number) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }

    async componentDidMount() {
        //animate progressbar and redirect
        for (let progress = 0; progress < 101; progress++) {
            await this.Sleep(20);
            this.setState({progress: progress});
        }

        //redirect to Login page
        window.location.href = FRONTEND_URL + "login";
    }

    render() {
        return (
            <section className="section">
                <div className="columns is-centered">
                    <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                        <br/><br/><br/>
                        <form className="box ">
                            <p>Your Email was successfully verified!</p>
                            <p>You can login now!</p>
                            <br/>
                            <progress className="progress is-success" value={this.state.progress} max="100">60%
                            </progress>
                        </form>

                    </div>
                </div>
            </section>
        );
    }
}