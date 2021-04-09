import React, { Component } from "react";

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state= {
            email: '',
            password: '',
            errorMessage: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    handleSubmit(event) {
        const email = this.state.email;
        const pw = this.state.password;
        event.preventDefault();

        if(!(email === '' || pw === '')){
            //catch wrong

            //hash Password ?

            //sends User credentials to API

            fetch('http://localhost:9000/backend/login', {
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
                if(response.status === 200){
                    response.json().then((data) => {
                        if(data.token){
                            // handle Access token and save it to session storage
                            sessionStorage.setItem('AccessToken', data.token); // if AccessToken != null --> User is logged in
                            // save the username in Session Storage
                            // JWT Has the following Syntax: XXXXXXXX.XXXXXXXX.XXXXXXXX where X is a Base64 encoded string
                            // The middle part contains the username and other things in JSON format --> get middle part, decode it from
                            // Base64 (with js function atob())
                            const splitToken = data.token.split('.');
                            const decodedJSON = JSON.parse(atob(splitToken[1]));
                            sessionStorage.setItem('username', decodedJSON.username);

                            //update status message
                            this.setState({errorMessage: "successfull login"});
                        }else {
                            this.setState({errorMessage: "Login Error Occured"});
                        }
                      });
                } else if (response.status === 401){
                    this.setState({errorMessage: "You have entered an invalid username or password"});
                } else {
                    this.setState({errorMessage: response.json().message});
                }
            });
        } else {
            this.setState({errorMessage:'Please enter an email and a password!'})
        }   
    }

    errorBox(){
        //renders an errorBox with the current state of the error message
        if(this.state.errorMessage === ''){
            return(<br></br>);
        } else{
            return(
                <div class="alert alert-primary" role="alert">{this.state.errorMessage}</div>
            );
        }
    }

    //return rendered component

    render() {
        return (
            <form>
                <h3>Log in</h3>

                <div className="form-group">
                    <label>Email</label>
                    <input type="email" autoFocus name="email" className="form-control" placeholder="Enter email" value={this.state.email} onChange={this.handleChange} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" className="form-control" placeholder="Enter password" value={this.state.password} onChange={this.handleChange} />
                </div>

                {this.errorBox()}

                <button className="btn btn-dark btn-lg btn-block" onClick={this.handleSubmit} >Sign in</button>
                <p className="forgot-password text-right">
                    Forgot <a href="#">password?</a>
                </p>
            </form>
        );
    }
}