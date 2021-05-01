import React from 'react';
import Head from '../components/Head';
import Foot from '../components/Foot';
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
    relationship: any
}

class User extends React.Component<any, State> {
    private readonly abortController: AbortController;

    constructor(props: any) {
        super(props);

        this.state = {
            username: props.match.params.username,
            firstname: '',
            lastname: '',
            date: new Date(),
            dateChange: false,
            weight: '',
            email: '',
            relationship: {}
        };

        this.abortController = new AbortController();

        this.getUserInformation();

        this.handleBlockClick = this.handleBlockClick.bind(this);
        this.handleFollowClick = this.handleFollowClick.bind(this);
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<State>, snapshot?: any) {
        // Get new values if username changed
        if (this.state.username !== this.props.match.params.username) {
            this.setState({
                username: this.props.match.params.username
            }, () => this.getUserInformation());
        }
    }

    componentWillUnmount() {
        this.abortController.abort()
    }

    getUserInformation() {
        // Fetch user data
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
                        firstname: data[0].firstname ? data[0].firstname : this.state.firstname,
                        lastname: data[0].lastname ? data[0].lastname : this.state.lastname,
                        date: data[0].date ? new Date(data[0].date) : this.state.date,
                        weight: data[0].weight ? data[0].weight : this.state.weight,
                        email: data[0].email ? data[0].email : this.state.email
                    });
                });
            } else {
                console.log('Looks like there was a problem. Status Code: ', response.status);
            }
        });

        // Get their relationship
        fetch(BACKEND_URL + "users/getRelationship?user=" + this.state.username, {
            method: "GET",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: SessionHandler.getAuthToken()
            },
            signal: this.abortController.signal
        }).then((response) => {
            if (response.ok) {
                response.json().then((response) => this.setState({
                    relationship: response
                }));
            }
        }).catch((error: any) => {
            // Don't react to 'AbortError's
            if (error.name !== "AbortError") {
                console.log(error);
            }
        });
    }

    handleBlockClick(event: any) {
        let hasBlocked = this.state.relationship.hasBlocked;
        let bodyContent = hasBlocked ? {unblocked: this.state.username} : {toBeBlocked: this.state.username};

        fetch(BACKEND_URL + "users/" + (hasBlocked ? "un" : "") + "block", {
            method: "PUT",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: SessionHandler.getAuthToken()
            },
            body: JSON.stringify(bodyContent),
            signal: this.abortController.signal
        }).then((response) => {
            if (response.ok) {
                this.getUserInformation();
            }
        }).catch((error: any) => {
            // Don't react to 'AbortError's
            if (error.name !== "AbortError") {
                console.log(error);
            }
        });

    }

    handleFollowClick(event: any) {
        if (!this.state.relationship.isBlocked) {
            let isFollowing = this.state.relationship.following;
            let bodyContent = isFollowing ? {unfollowed: this.state.username} : {followed: this.state.username};

            fetch(BACKEND_URL + "users/" + (isFollowing ? "un" : "") + "follow", {
                method: "PUT",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: SessionHandler.getAuthToken()
                },
                body: JSON.stringify(bodyContent),
                signal: this.abortController.signal
            }).then((response) => {
                if (response.ok) {
                    this.getUserInformation();
                }
            }).catch((error: any) => {
                // Don't react to 'AbortError's
                if (error.name !== "AbortError") {
                    console.log(error);
                }
            });
        }
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
                    <button
                        className="button is-success"
                        onClick={this.handleFollowClick}
                        disabled={this.state.relationship.blocked}
                    >
                        {(this.state.relationship.following ? "Unf" : "F") + "ollow"}
                    </button>
                    <button
                        className="button is-danger"
                        onClick={this.handleBlockClick}
                    >
                        {(this.state.relationship.hasBlocked ? "Unb" : "B") + "lock"}
                    </button>
                </div>
                <Foot/>
            </section>
        )
    }
}

export default User

