import React, {Component} from "react";
import {BACKEND_URL} from "../App";
import SessionHandler from "../utilities/SessionHandler";

/*Here is the component of the Follow UserProfile Site.
* Here the user see the account values of any user you want*/

interface State {
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    date: Date,
    dateChange: Boolean,
    weight: number | string,
}

export default class FollowUserSite extends Component<{ username: string }, State> {
    constructor(props: any) {
        super(props);

        this.state = {
            username: props.username,
            firstname: '',
            lastname: '',
            date: new Date(),
            dateChange: false,
            weight: '',
            email: '',

        };

        this.getDefaultValues();
    }

    getDefaultValues() {
        fetch(BACKEND_URL + "users/" + this.state.username, {//get as default
            headers: {
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
                if (data[0].firstname) this.setState({firstname: data[0].firstname});
                if (data[0].lastname) this.setState({lastname: data[0].lastname});
                if (data[0].date) this.setState({date: new Date(data[0].date)});
                if (data[0].weight) this.setState({weight: data[0].weight});
                if (data[0].email) this.setState({email: data[0].email});
            });
        });
    }

    render() {
        return (
            <div className="section has-background-black-ter">
                <div className="section container box">
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
        )
    }
}
