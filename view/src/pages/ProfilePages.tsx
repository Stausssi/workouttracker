import React from 'react';
import {Helmet} from "react-helmet";

import Head from '../components/Head';
import Foot from '../components/Foot';
import SessionHandler from "../utilities/SessionHandler";
import {BACKEND_URL, PAGE_TITLE} from "../App";
import DatePicker from "react-datepicker";
import NotificationBox from "../components/NotificationBox";
import {postData} from "../components/Feed/FeedContent";
import {ProfileActivityContainer} from "../components/profile/ProfileActivities";
import {Formatter} from "../utilities/Formatter";

//Validate email address from input to show a warning if something went Wrong
function validateEmail(email: string) {
    return /^[^@]+@\w+(\.\w+)+\w$/.test(email);
}

interface OwnState {
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

    errorMessage: string
}

//Profile page
export class OwnProfile extends React.Component<any, OwnState> {
    constructor(props: any) {
        super(props);

        this.state = {
            username: SessionHandler.getUsername(),
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
        } as unknown as Pick<OwnState, keyof OwnState>);
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
                this.setState({errorMessage: 'Please enter a valid email'});
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
            <>
                <Helmet>
                    <title>{PAGE_TITLE} | Profile</title>
                </Helmet>
                <Head/>
                <div id="body-content" className="has-background-black-ter hasScrollbar">
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
                                className='button is-black is-outlined'
                                type='submit'
                                onClick={this.handleSubmit}
                            >
                                Change Data
                            </button>
                        </form>
                    </div>
                </div>
                <Foot/>
            </>
        )
    }
}

interface FollowingState {
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    date: Date,
    dateChange: Boolean,
    weight: number | string,
    relationship: any
    postData: postData[] | [],
}

export class FollowingPage extends React.Component<any, FollowingState> {
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
            relationship: {},
            postData: [],
        };

        this.abortController = new AbortController();

        this.getUserInformation();

        this.handleBlockClick = this.handleBlockClick.bind(this);
        this.handleFollowClick = this.handleFollowClick.bind(this);
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<FollowingState>, snapshot?: any) {
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
            signal: this.abortController.signal
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
        }).catch((error: any) => {
            // Don't react to 'AbortError's
            if (error.name !== "AbortError") {
                console.log(error);
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
            <>
                <Helmet>
                    <title>{PAGE_TITLE} | {this.state.username}'s profile</title>
                </Helmet>
                <Head/>
                <div className="section has-background-black-ter">
                        <div className="container">
                        <div className="card is-medium">
                            <div className="card-content">
                                <div className="media">
                                    <div className="media-left">
                                        <figure className="image is-48x48">
                                            <img src="https://bulma.io/images/placeholders/96x96.png"
                                                 alt="Placeholder"/>
                                        </figure>
                                    </div>
                                    <div className="media-content">
                                        <p className="title is-4">{this.state.firstname} {this.state.lastname}</p>
                                        <p className="subtitle is-6">@{this.state.username}</p>

                                    </div>

                                    <div className="field has-addons">
                                        {
                                            this.state.username !== SessionHandler.getUsername() ?
                                                <>
                                                    <button
                                                        className="button is-success mr-2"
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
                                                </> :
                                                <></>
                                        }
                                    </div>
                                </div>

                                <div className="content">
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <td><b>Date of Birth</b></td>
                                            <td><b>Weight</b></td>
                                            <td><b>E-Mail</b></td>
                                        </tr>
                                        </thead>
                                    <tbody>
                                        <tr>
                                            <td>{Formatter.formatDate(this.state.date)}</td>
                                            <td>{this.state.weight} kg</td>
                                            <td>{this.state.email}</td>
                                        </tr>
                                    </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                            <div className="box mt-4">
                                <div className="is-divider" data-content="Most Recent Activities"/>
                                <ProfileActivityContainer username={this.state.username}/>
                            </div>
                        </div>
                </div>
                <Foot/>
            </>
        )
    }
}
