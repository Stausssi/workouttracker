import React, {Component} from "react";
import NotificationBox from "../notificationBox";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {BACKEND_URL, FRONTEND_URL} from "../../App";

function validateEmail(email: string)
{
    return /^[^@]+@\w+(\.\w+)+\w$/.test(email);
}

function validatePassword(password: string){
    // regex for: min 8 letter password, with at least a symbol, upper and lower case letters and a number
    return /^(?=.*\d)(?=.*[!@#$%^&_*-])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);
}

interface State {
    firstname: string,
    lastname: string,
    email: string,
    password1: string,
    password2: string,
    errorMessage: string,
    username: string,
    weight: number,
    date: Date,
    dateChange: Boolean
}

export default class SignUp extends Component<{},State> {
    constructor(props: any) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            password1: '',
            password2: '',
            errorMessage: '',
            username: '',
            weight: 0,
            date: new Date(),
            dateChange: false
        };

        // bind scopes to functions in order to use this.setState
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        // makes all input attributes "controlled components"
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        } as unknown as Pick<State, keyof State>);
    }

    handleDateChange(date: Date) {
        this.setState({date:date, dateChange:true});
    }

    handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        const email = this.state.email;
        const pw1 = this.state.password1;
        const pw2 = this.state.password2;
        const firstname = this.state.firstname;
        const lastname = this.state.lastname;
        const username = this.state.username;
        const weight = this.state.weight;
        event.preventDefault();

        if (!(email === '' || pw1 === '' || pw2 === '' || firstname === '' || lastname === '' || username === '' || weight === 0 || !this.state.dateChange)) {
            //all inputs must be filled
            if(firstname.length <= 30 && lastname.length <= 30) {
                //firstname/Lastname max 30 characters
                if(username.length <= 20) {
                    //username max 20 characters
                    if(validateEmail(email)) {
                        //email must have correct form
                        if(weight >= 10 && weight <= 250) {
                            if (pw1 === pw2) {
                                //the passwords must be equal
                                if (validatePassword(pw1)) {
                                    // password must have at least 8 letters, a symbol, upper case letters and a number

                                    // set date to date string
                                    const dateString = this.state.date.toISOString().slice(0, 10);

                                    //sends User credentials to API

                                    fetch(BACKEND_URL + 'signup', {
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
                                            username: username,
                                            date: dateString,
                                            weight: weight
                                        })
                                    }).then((response) => {
                                        if (response.ok) {
                                            if (response.status === 201) {
                                                //update error message: --> success
                                                this.setState({errorMessage: "The user was created!"});

                                                //redirect to confirmation page
                                                window.location.href = FRONTEND_URL + "successful-signup";
                                            } else {
                                                //update error message: --> no success
                                                this.setState({errorMessage: "The given username or email already exist!"});
                                            }
                                        } else {
                                            this.setState({errorMessage: "A server error occured!"});
                                        }
                                    });
                                } else {
                                    this.setState({errorMessage: 'Your password must have at least 8 letters, a symbol, upper case letters and a number'});
                                }
                            } else {
                                this.setState({errorMessage: 'The passwords must be equal!'});
                            }
                        } else {
                            this.setState({errorMessage: 'Please enter a real weight!'});
                        }
                    }else {
                        this.setState({errorMessage: 'Please enter a correct email!'});
                    }
                } else {
                    this.setState({errorMessage: 'The username must have 20 characters or less'});
                }
            } else {
                this.setState({errorMessage: 'The firstname/lastname must have 30 characters or less'});
            }
        } else {
            this.setState({errorMessage: 'Please fill out every field!'});
        }
    }

    render() {
        return (
            <section className="section" >
                        <div className="columns is-centered">
                            <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                                <form className="box">
                                    <h3 className="title">Register</h3>

                                    <div className="field is-horizontal">
                                        <div className="field-label is-normal">
                                            <label className="label">Name</label>
                                        </div>
                                        <div className="field-body">
                                            <div className="field">
                                                <input autoFocus name="firstname" type="text" className="input" placeholder="First name"
                                                       value={this.state.firstname} onChange={this.handleChange}/>
                                            </div>
                                            <div className="field">
                                                <input name="lastname" type="text" className="input" placeholder="Last name"
                                                       value={this.state.lastname} onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="field is-horizontal">
                                        <div className="field-label is-normal">
                                            <label className="label">Username</label>
                                        </div>
                                        <div className="field-body">
                                            <div className="field">
                                                <input name="username" type="text" className="input" placeholder="Enter username"
                                                       value={this.state.username} onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="field is-horizontal">
                                        <div className="field-label is-normal">
                                            <label className="label">Email</label>
                                        </div>
                                        <div className="field-body">
                                            <div className="field">
                                                <input name="email" type="email" className="input has-icons-left" placeholder="Enter email"
                                                       value={this.state.email} onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                    </div>

                                    <hr/>

                                    <div className="field is-horizontal">
                                        <div className="field-label is-normal">
                                            <label className="label">Date of Birth</label>
                                        </div>
                                        <div className="field-body">
                                            <div className="field">
                                                <DatePicker selected={this.state.date} onChange={this.handleDateChange} dateFormat="dd.MM.yyyy"/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="field is-horizontal">
                                        <div className="field-label is-normal">
                                            <label className="label">Weigth (kg)</label>
                                        </div>
                                        <div className="field-body">
                                            <div className="field">
                                                <input name="weight" type="number" className="input" placeholder="Enter weight" min="10" max="200"
                                                       value={this.state.weight} onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                    </div>

                                    <hr/>

                                    <div className="field is-horizontal">
                                        <div className="field-label is-normal">
                                            <label className="label">Password</label>
                                        </div>
                                        <div className="field-body">
                                            <div className="field">
                                                <input name="password1" type="password" className="input" placeholder="Enter password"
                                                       value={this.state.password1} onChange={this.handleChange}/>
                                            </div>
                                            <div className="field">
                                                <input name="password2" type="password" className="input" placeholder="Confirm password"
                                                       value={this.state.password2} onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                    </div>

                                    <br/>

                                    <NotificationBox message={this.state.errorMessage} type={"is-danger"} hasDelete={false}/>

                                    <button className="button is-primary" onClick={this.handleSubmit}>Register</button>
                                </form>
                            </div>
                        </div>
            </section>
        );
    }
}
