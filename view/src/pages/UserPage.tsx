import React from 'react';
import Head from '../Head';
import Foot from '../Foot';
import {BACKEND_URL} from "../App";
import SessionHandler from "../utilities/SessionHandler";

interface State {
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    date: Date,
    dateChange: Boolean,
    weight: number | string,
}

class User extends React.Component<any, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            username: props.match.params.username,
            firstname: '',
            lastname: '',
            date: new Date(),
            dateChange: false,
            weight: '',
            email: ''
        };

        this.getUserInformation();
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<State>, snapshot?: any) {
        // Get new values if username changed
        if (this.state.username !== this.props.match.params.username) {
            this.setState({
                username: this.props.match.params.username
            }, () => this.getUserInformation());
        }
    }

    getUserInformation() {
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
                        lastname: data[0].lastname ? '' : this.state.lastname,
                        date: data[0].date ? new Date(data[0].date) : this.state.date,
                        weight: data[0].weight ? '' : this.state.weight,
                        email: data[0].email ? '' : this.state.email
                    });
                });
            } else {
                console.log('Looks like there was a problem. Status Code: ', response.status);
            }
        });
    }

    render() {
        return (
            <section className='main'>
                <Head/>
                <div className="section has-background-black-ter">
                    <div className="container box">
                        <p className="is-size-4">This is the page from {this.state.username},<br/> here you can see some
                            general information</p>
                        <div className='field'>
                            <label className="label">Firstname</label>
                            <p>{this.state.firstname}</p>
                        </div>
                        <div className='field'>
                            <label className="label">Lastname</label>
                            <p>{this.state.lastname}</p>
                        </div>
                        <div className='field'>
                            <label className="label">Date of Birth</label>
                            <p>{this.state.date.toISOString().slice(0, 10)}</p>
                        </div>
                        <div className='field'>
                            <label className="label">Weight</label>
                            <p>{this.state.weight}</p>
                        </div>
                        <div className='field'>
                            <label className="label">e-mail</label>
                            <p>{this.state.email}</p>
                        </div>
                    </div>
                </div>
                <Foot/>
            </section>
        )
    }
}

export default User

