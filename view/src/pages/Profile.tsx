import React from 'react';
import Head from '../components/Head';
import Foot from '../components/Foot';
import SessionHandler from "../utilities/SessionHandler";
import {BACKEND_URL} from "../App";
import DatePicker from "react-datepicker";
import NotificationBox from "../components/NotificationBox";

//Validate email address from input to show a warning if something went Wrong
function validateEmail(email: string) {
    return /^[^@]+@\w+(\.\w+)+\w$/.test(email);
}

interface State {
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    date: Date,
    dateChange: Boolean,
    weight: number | string,

    firstnamePlaceholder: string;
    lastnamePlaceholder: string;
    weightPlaceholder: string;
    emailPlaceholder: string;

    errorMessage: string,

}

//Profile page
class Profile extends React.Component<any, State> {
    constructor(props: any) {
        super(props);
        let username = "undefined Username";
        if (SessionHandler.getUser()) {
            // @ts-ignore
            username = SessionHandler.getUser().username.toString();
        }

        this.state = {
            username: username,
            firstname: '',
            lastname: '',
            date: new Date(),      //it is now date
            dateChange: false,
            weight: '',
            email: '',

            firstnamePlaceholder: 'Add your firstname',
            lastnamePlaceholder: 'Add your lastname',
            weightPlaceholder: 'Add your weight',
            emailPlaceholder: 'Add your email',

            errorMessage: '',
        };

        this.getDefaultValues();

        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //get placeholders by loading the Page
    getDefaultValues() {
        fetch(BACKEND_URL + "users/get/" + this.state.username, {//get as default
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: SessionHandler.getAuthToken()
            },
        }).then((response) => {
            if (response.ok) {
                // Examine the text in the response
                response.json().then((data) => {
                    this.setState({
                        firstname: data[0].firstname ? '' : this.state.firstname,
                        firstnamePlaceholder: data[0].firstname ? data[0].firstname : this.state.firstnamePlaceholder,
                        lastname: data[0].lastname ? '' : this.state.lastname,
                        lastnamePlaceholder: data[0].lastname ? data[0].lastname : this.state.lastnamePlaceholder,
                        date: data[0].date ? new Date(data[0].date) : this.state.date,
                        weight: data[0].weight ? '' : this.state.weight,
                        weightPlaceholder: data[0].weight ? data[0].weight : this.state.weightPlaceholder,
                        email: data[0].email ? '' : this.state.email,
                        emailPlaceholder: data[0].email ? data[0].email : this.state.emailPlaceholder,
                    });
                });
            } else {
                console.log('Looks like there was a problem. Status Code: ', response.status);
            }
        });
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

    //if submit new changes to the system
    handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        this.setState({errorMessage: ''});
        let date = "";
        if (this.state.dateChange) {
            this.setState({dateChange: false});

            // add a day because the minutes toISOString converts it not right
            const datePusOneDay = new Date(this.state.date.getTime() + 86400000);
            date = datePusOneDay.toISOString().slice(0, 10);
        }
        let email = "";
        if (this.state.email) {
            if (validateEmail(this.state.email)) {
                email = this.state.email;
                this.setState({
                    emailPlaceholder: this.state.email,
                    email: ''
                });
            } else {
                this.setState({errorMessage: 'Please fill out a valid email'});
            }
        }
        //nice put req to parse the data in the DB
        fetch(BACKEND_URL + 'users/update', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: SessionHandler.getAuthToken()
            },
            body: JSON.stringify({
                firstname: this.state.firstname,
                lastname: this.state.lastname,
                date: date,
                weight: this.state.weight,
                email: email,
            }),
        });

        if (this.state.firstname) {
            this.setState({
                firstnamePlaceholder: this.state.firstname,
                firstname: ''
            });
        }

        if (this.state.lastname) {
            this.setState({
                lastnamePlaceholder: this.state.lastname,
                lastname: ''
            });
        }

        if (this.state.weight) {
            this.setState({
                weightPlaceholder: this.state.weight.toString(),
                weight: ''
            });
        }
    }

    handleDateChange(date: Date) {
        this.setState({date: date, dateChange: true});
    }

    render() {
        return (
            <section className='main'>
                <Head/>
                <div className="section has-background-black-ter">
                    <div className="container">
                        <form className='box'>
                            <p className="is-size-4">Hello {this.state.username},<br/> here you can change your account
                                values</p>
                            <div className='field'>
                                <label className="label">Firstname</label>
                                <input
                                    className="input"
                                    name='firstname'
                                    type='text'
                                    maxLength={30}
                                    placeholder={this.state.firstnamePlaceholder} value={this.state.firstname}
                                    onChange={this.handleChange}/>
                            </div>
                            <div className='field'>
                                <label className="label">Lastname</label>
                                <input
                                    className="input"
                                    name='lastname'
                                    type='text'
                                    maxLength={30}
                                    placeholder={this.state.lastnamePlaceholder} value={this.state.lastname}
                                    onChange={this.handleChange}/>
                            </div>
                            <div className='field'>
                                <label className="label">Date of Birth</label>
                                <DatePicker
                                    maxDate={new Date()}
                                    selected={this.state.date}
                                    onChange={this.handleDateChange}
                                    dateFormat="dd.MM.yyyy"/>
                            </div>
                            <div className='field'>
                                <label className="label">Weight</label>
                                <input
                                    className="input"
                                    name='weight'
                                    type='number'
                                    min="0"
                                    max="300"
                                    placeholder={this.state.weightPlaceholder} value={this.state.weight}
                                    onChange={this.handleChange}/>
                            </div>
                            <div className='field'>
                                <label className="label">e-mail</label>
                                <input
                                    className="input"
                                    name='email'
                                    type='email'
                                    maxLength={50}
                                    placeholder={this.state.emailPlaceholder} value={this.state.email}
                                    onChange={this.handleChange}/>
                            </div>
                            <br/>

                            <NotificationBox message={this.state.errorMessage} type={"is-danger"} hasDelete={false}/>

                            <button
                                className='input is-black is-outlined'
                                type='submit'
                                onClick={this.handleSubmit}
                            >
                                Change Data
                            </button>
                        </form>
                    </div>
                </div>
                <Foot/>
            </section>
        )
    }
}

export default Profile

