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

            fetch('http://localhost:3000/backend/login', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: pw
                })
            }).then((response) => {
                if(response.ok){
                    if(response.status === 201){
                        //update error message: --> success
                        this.setState({errorMessage: "user was created!"});

                        // redirect oder popup
                        // handle token
                        // Username in irgendeinen Storage zwischenspeichern
                        // Speicherung Token in Cookie/ APP- State --> Session Storage

                    }else{
                        //update error message: --> no success
                        this.setState({errorMessage: "The given username or email already exist!"});
                    }
                }else{
                    this.setState({errorMessage: "A server error occured!"});
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