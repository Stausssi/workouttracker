import React, { Component } from "react";

export default class SignUp extends Component {

    constructor(props){
        super(props);
        this.state= {
            firstname: '',
            lastname: '',
            email: '',
            password1: '',
            password2: '',
            errorMessage: '',
            username: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        // makes all input attributes "controlled components"
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    handleSubmit(event) {
        const email = this.state.email;
        const pw1 = this.state.password1;
        const pw2 = this.state.password2;
        const firstname = this.state.firstname;
        const lastname = this.state.lastname;
        const username = this.state.username;
        event.preventDefault();

        if(!(email === '' || pw1 === '' || pw2 === '' || firstname === '' || lastname === '' || username === '')){
            //all inputs must be filled
            if(pw1 === pw2){
                //the passwords must be equal
                if(pw1.length > 4){
                    //password must be longer than 4 characters
                    alert('Login: Email ' + email + ' Pw: ' +  pw1);
    
                    //sends User credentials to API
    
                    fetch('http://localhost:9000/backend/signup', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            firstname: firstname,
                            lastname: lastname,
                            email: email,
                            password: pw1,
                            username: username
                        })
                    }).then((response) => {
                        if(response.ok){
                            if(response.status === 201){
                                //update error message: --> success
                                this.setState({errorMessage: "The user was created!"});
        
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
                    this.setState({errorMessage:'The passwords must have at least 5 characters!'})
                }
            } else {
                this.setState({errorMessage:'The passwords must be equal!'})
            }
        } else {
            this.setState({errorMessage:'Please fill out every field!'})
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

    render() {
        return (
            <form>
                <h3>Register</h3>

                <div className="form-group">
                    <label>First name</label>
                    <input autoFocus name="firstname" type="text" className="form-control" placeholder="First name"  value={this.state.firstname} onChange={this.handleChange}/>
                </div>

                <div className="form-group">
                    <label>Last name</label>
                    <input name="lastname" type="text" className="form-control" placeholder="Last name" value={this.state.lastname} onChange={this.handleChange}/>
                </div>

                <div className="form-group">
                    <label>Username</label>
                    <input name="username" type="text" className="form-control" placeholder="Enter username" value={this.state.username} onChange={this.handleChange}/>
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input name="email" type="email" className="form-control" placeholder="Enter email" value={this.state.email} onChange={this.handleChange}/>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input name="password1" type="password" className="form-control" placeholder="Enter password" value={this.state.password1} onChange={this.handleChange}/>
                </div>

                <div className="form-group">
                    <label>Confirm Password</label>
                    <input name="password2" type="password" className="form-control" placeholder="Confirm password" value={this.state.password2} onChange={this.handleChange}/>
                </div>

                {this.errorBox()}

                <button className="btn btn-dark btn-lg btn-block" onClick={this.handleSubmit}>Register</button>
                <p className="forgot-password text-right">
                    Already registered <a href="#">log in?</a>
                </p>
            </form>
        );
    }
}