import React, {Component} from "react";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import NotificationBox from "./notificationBox";

interface Props {
    sports: { [key: string]: number }
}

interface State {
    [key: string]: any
}

const defaultActivityState = {
    sport: 0,
    sportClass: "",
    duration: 0,
    durationClass: "",
    durationIcon: faTimes,
    durationIconClass: "",
    durationMul: 60,
    distance: 0,
    distanceClass: "",
    distanceIcon: faTimes,
    distanceIconClass: "",
    distanceMul: 10,
    heartRate: 0,
    heartRateClass: "",
    heartRateIcon: faTimes,
    heartRateIconClass: ""
}

}

const defaultStates: any[] = [defaultActivityState, defaultNotifyState];
const defaultState = Object.assign({}, defaultActivityState, defaultNotifyState);

// represents [min, max] values for the corresponding input field
const validValues: { [key: string]: any[] } = {
    "sport": [0, null],
    "duration": [0, null],
    "distance": [0, null],
    "heartRate": [25, 250],
}

const hasIcon: string[] = ["duration", "distance", "heartRate"];

enum RESET_TYPES {
    ACTIVITY,
    NOTIFICATION
}

const notifyMessages: { [ident: string]: [message: string, type: string] } = {
    "fetchFailed":
        ["Die Sportarten konnten nicht abgerufen werden!<br /> Versuche es später erneut, oder kontaktiere einen Administrator.", "is-danger"],
}

export default class AddActivity extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            activityID: 0,
            duration: 0,
            durationMul: 60,
            distance: 0,
            distanceMul: 10,
            heartRate: 0,
            notifyMessage: "",
            notifyType: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        // Check for prop changes
        if (prevProps.sports !== this.props.sports) {
            if (Object.keys(this.props.sports).length === 0) {
                this.setState({
                    notifyMessage: notifyMessages["fetchFailed"][0],
                    notifyType: notifyMessages["fetchFailed"][1]
                });
            }
        }
    }

    handleChange(event: any) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        if (value < 0) {
            return
        }

        let newState = {
            notifyMessage: "",
            activityID: this.state.activityID,
            duration: this.state.duration,
            distance: this.state.distance,
            heartRate: this.state.heartRate
        };

        switch (name) {
            case "activityList":
                newState.activityID = value;
                break;
            case "duration":
                newState.duration = value;
                break;
            case "distance":
                newState.distance = value;
                break;
            case "heartRate":
                newState.heartRate = value;
                break;
            default:
                break;
        }

        // Callback to validateInput in order to make the button clickable
        this.setState(newState, this.validateInput);
    }

    validateInput() {
        let valid =
            Number(this.state.activityID) !== 0 &&
            this.state.distance > 0 &&
            this.state.duration > 0 &&
            this.state.heartRate > 0;

        let submit = document.getElementById("submit-activity");
        if (submit) {
            if (valid) {
                if (icon) {
                    this.setState({
                        [name + "Icon"]: faCheck,
                        [name + "IconClass"]: "has-text-success"
                    });
                }
            } else {
                if (icon) {
                    this.setState({
                        [name + "Icon"]: faTimes,
                        [name + "IconClass"]: ""
                    });
                }
            }
        }
        return valid;
    }

    handleSubmit(event: any) {
        event.preventDefault();

        if (this.state.submitButton.hasAttribute("disabled")) return;

        console.log("Submit:", this.state);

        // TODO: Filter params and insert into database

        // fetch("http://localhost:9000/backend/activity/add", {
        //     method: "POST",
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         test: "test"
        //     })
        // }).then((response) => {
        //     if(response.ok) {
        //         this.setState({notifyMessage: "Activity submitted", notifyType: "is-success"});
        //     }
        // });
        this.setState({notifyMessage: "Activity submitted", notifyType: "is-success"});
        // Disable submit button and reset form
        this.allowSubmit(false);
        this.resetState(RESET_TYPES.ACTIVITY);
    }

    handleReset(event: any) {
        event.preventDefault();

        this.resetState(RESET_TYPES.NOTIFICATION);
        this.resetState(RESET_TYPES.ACTIVITY);
        this.allowSubmit(false);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <NotificationBox message={this.state.notifyMessage} type={this.state.notifyType}/>

                <label className="label">Art der Aktivität</label>
                <div className={`select is-fullwidth mb-5 ${this.state.sportClass}`}>
                    <select name="sport" onChange={this.handleChange} value={this.state.sport}>
                        {this.state.notifyMessage !== notifyMessages["fetchFailed"][0] ?
                            this.createSportSelect() :
                            <option key="-1" value="-1">Es ist ein Fehler aufgetreten!</option>}
                    </select>
                </div>

                <label className="label">Dauer</label>
                <div className="columns">
                    <div className="column">
                        <div className="field">
                            <div className="control has-icons-right">
                                <input
                                    className={`input ${this.state.durationClass}`}
                                    type="number"
                                    name="duration"
                                    placeholder="Gebe hier die Dauer der Aktivität an"
                                    value={Number(this.state.duration) === 0 ? "" : this.state.duration}
                                    onChange={this.handleChange}
                                />
                                <span className={`icon is-right ${this.state.durationIconClass}`}>
                                    <FontAwesomeIcon icon={this.state.durationIcon}/>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="column is-2">
                        <div className="select is-fullwidth">
                            <select name="durationMul" onChange={this.handleChange} defaultValue="60">
                                <option value="1">s</option>
                                <option value="60">m</option>
                                <option value="3600">h</option>
                            </select>
                        </div>
                    </div>
                </div>

                <label className="label">Distanz</label>
                <div className="columns">
                    <div className="column">
                        <div className="field">
                            <div className="control has-icons-right">
                                <input
                                    className={`input ${this.state.distanceClass}`}
                                    type="number"
                                    name="distance"
                                    placeholder="Gebe hier die zurückgelegte Distanz an"
                                    value={Number(this.state.distance) === 0 ? "" : this.state.distance}
                                    onChange={this.handleChange}
                                />
                                <span className={`icon is-right ${this.state.distanceIconClass}`}>
                                    <FontAwesomeIcon icon={this.state.distanceIcon}/>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="column is-2">
                        <div className="select is-fullwidth">
                            <select className="select" name="distanceMul" onChange={this.handleChange} defaultValue="1">
                                <option value="1">m</option>
                                <option value="1000">km</option>
                            </select>
                        </div>
                    </div>
                </div>

                <label className="label">Herzrate</label>
                <div className="columns">
                    <div className="column is-full">
                        <input
                            className="input"
                            type="number"
                            name="heartRate"
                            placeholder="Gebe hier deine durchschnittliche Herzrate an"
                            value={this.state.heartRate === 0 ? "" : this.state.heartRate}
                            onChange={this.handleChange}
                        />
                        <span className={`icon is-right ${this.state.heartRateIconClass}`}>
                            <FontAwesomeIcon icon={this.state.heartRateIcon}/>
                        </span>
                    </div>
                </div>
            </form>
        );
    }

    createSportSelect() {
        let sports = [];
        sports.push(<option value="0" key="0"/>);

        for (let key in this.props.sports) {
            sports.push(<option value={key} key={key}>{key}</option>);
        }
        return sports;
    }

    validateInput() {
        let valid =
            this.isValid("sport", this.state.sport) &&
            this.isValid("distance", this.state.distance) &&
            this.isValid("duration", this.state.duration) &&
            this.isValid("heartRate", this.state.heartRate);

        if (this.state.submitButton) {
            this.allowSubmit(valid);
        }
    }

    isValid(type: string, value: number) {
        let min = validValues[type][0];
        let max = validValues[type][1];
        value = Number(value);

        return (min < value && (max ? value < max : true)) || isNaN(value);
    }

    allowSubmit(state: boolean) {
        state ?
            this.state.submitButton.removeAttribute("disabled") :
            this.state.submitButton.setAttribute("disabled", "");
    }

    resetState(type: RESET_TYPES) {
        this.setState(defaultStates[type]);
    }
}
}
