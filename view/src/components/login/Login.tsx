import React, {Component} from "react";
import NotificationBox from "../notificationBox";
import {BACKEND_URL, FRONTEND_URL} from "../../App";

interface State {
    email: string,
    password: string,
    errorMessage: string
}

export default class Login extends Component<{}, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            email: '',
            password: '',
            errorMessage: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        }as Pick<State, keyof State>);
    }

    handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        const email = this.state.email;
        const pw = this.state.password;
        event.preventDefault();

        if (!(email === '' || pw === '')) {
            //catch wrong

            //hash Password ?

            //sends User credentials to API

            fetch( BACKEND_URL + 'login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    emailOrUsername: email,
                    password: pw
                })
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                        if (data.token) {
                            // handle Access token and save it to session storage
                            sessionStorage.setItem('AccessToken', data.token); // if AccessToken != null --> User is logged in
                            // save the username in Session Storage
                            // JWT Has the following Syntax: XXXXXXXX.XXXXXXXX.XXXXXXXX where X is a Base64 encoded string
                            // The middle part contains the username and other things in JSON format --> get middle part, decode it from
                            // Base64 (with js function atob())
                            const splitToken = data.token.split('.');
                            const decodedJSON = JSON.parse(atob(splitToken[1]));
                            sessionStorage.setItem('username', decodedJSON.username);

                            // Redirect
                            window.location.href = FRONTEND_URL;
                        } else {
                            this.setState({errorMessage: "Login Error Occured"});
                        }
                    });
                } else if (response.status === 401) {
                    this.setState({errorMessage: "You have entered an invalid username or password"});
                } else {
                    this.setState({errorMessage: "Error!"});
                }
            });
        } else {
            this.setState({errorMessage: 'Please enter an email and a password!'})
        }
    }

    //return rendered component
    render() {
        return (
            <section className="section" >
                <div className="columns is-centered">
                    <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                        <form className="box ">
                            <h3 className="title">Log in</h3>

                            <div className="field">
                                <label className="label">Email or username</label>
                                <div className="control">
                                    <input type="email" autoFocus name="email" className="input"
                                           placeholder="Enter email"
                                           value={this.state.email} onChange={this.handleChange}/>
                                </div>
                            </div>

                            <div className="field">
                                <label className="label">Password</label>
                                <div className="control">
                                    <input type="password" name="password" className="input" placeholder="Enter password"
                                           value={this.state.password} onChange={this.handleChange}/>
                                </div>
                            </div>

                            <NotificationBox message={this.state.errorMessage} type={"is-success"} hasDelete={false}/>

                            <button className="button is-primary" onClick={this.handleSubmit}>Sign in</button>
                            <br/>
                        </form>
                    </div>
                </div>
            </section>
        );
    }
}