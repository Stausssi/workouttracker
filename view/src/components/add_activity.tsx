import React, {Component} from "react";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import NotificationBox from "./notificationBox";
import SessionHandler from "../SessionHandler";

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
    heartRateIconClass: "",
    altitude: 0,
    altitudeClass: "",
    altitudeIcon: faTimes,
    altitudeIconClass: ""
}

}

const defaultStates: any[] = [defaultActivityState, defaultNotifyState];
const defaultState = Object.assign({}, defaultActivityState, defaultNotifyState);

// represents [min, max] values for the corresponding input field
const validValues: { [key: string]: any[] } = {
    "sport": [0, null],
    "duration": [0, null],
    "distance": [0, null],
    "pace": [0, null],
    "heartRate": [25, 250],
    "altitude": [0, null]
}

const hasIcon: string[] = ["duration", "distance", "heartRate", "altitude"];

enum RESET_TYPES {
    ACTIVITY,
    NOTIFICATION
}

const notifyMessages: { [ident: string]: [message: string, type: string] } = {
    "fetchFailed":
        ["Die Sportarten konnten nicht abgerufen werden!<br /> Versuche es später erneut, oder kontaktiere einen Administrator.", "is-danger"],
    "success":
        ["Die Aktivität wurde erfolgreich gespeichert!", "is-success"]
}

const NUM_FIELDS = 5;
const inputFields: string[] = ["distance", "duration", "pace", "heartRate", "altitude"];

export default class AddActivity extends Component<Props, State> {
    HTMLFields: { [field: string]: JSX.Element; } | undefined;
    mustParams: boolean[] = [];

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

        // bind this to event handlers
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

        // Check for state changes
        if (prevState.sport !== this.state.sports) {
            if (!isNaN(this.state.sports)) {
                this.mustParams = [];
            }
        }
    }

    handleChange(event: any) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        if (value < 0) {
            return;
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

        // Prevent false submits
        if (this.state.submitButton.hasAttribute("disabled")) return;

        // Check whether all must-params are valid
        if (this.validateInput(true)) {
            // Create POST-request body content
            let bodyContent: { [key: string]: any } = {
                "sport": this.state.sport
            };

            // Append must and valid optional params
            for (let index in this.mustParams) {
                let key = inputFields[index];
                let value = this.state[key];

                if (this.mustParams[index] || (this.optParams[index] && this.isValid(key, value))) {
                    bodyContent = Object.assign({}, bodyContent, {[key]: value});
                }
            }

            // Send post request
            fetch("http://localhost:9000/backend/activity/add", {
                method: "POST",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: SessionHandler.getAuthToken()
                },
                body: JSON.stringify(bodyContent)
            }).then((response) => {
                if (response.ok) {
                    this.setState({notifyMessage: notifyMessages["success"][0], notifyType: notifyMessages["success"][1]});

                    // Disable submit button and reset form
                    this.allowSubmit(false);
                    this.resetState(RESET_TYPES.ACTIVITY);
                } else {
                    return response.json().then((response) => {
                        response.errno === 1 ?
                            this.setState({notifyMessage: notifyMessages["unknownUser"][0], notifyType: notifyMessages["unknownUser"][1]}) :
                            this.setState({notifyMessage: notifyMessages["error"][0], notifyType: notifyMessages["error"][1]});
                    });
                }
            });
        }
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
                        {
                            this.state.notifyMessage !== notifyMessages["fetchFailed"][0] ?
                                this.createSportSelect() :
                                <option key="-1" value="-1">Es ist ein Fehler aufgetreten!</option>
                        }
                    </select>
                </div>

                {this.createFormFields()}
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

    createFormFields() {
        console.log("forms Select");
        // Create HTML Fields template
        // Executed on the client -> no performance problem for now
        this.HTMLFields = {
            "distance": <>
                <label className="label">Distanz</label>
                <div className="columns">
                    <div className="column">
                        <div className="field">
                            <div className="control has-icons-right">
                                <input
                                    className={`input ${this.state.distanceClass}`}
                                    type="number"
                                    name="distance"
                                    placeholder="Gebe hier die zurückgelegte Distanz ein"
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
                            <select className="select" name="distanceMul" onChange={this.handleChange}
                                    value={this.state.distanceMul}>
                                <option value="1" key="dist_m">m</option>
                                <option value="1000" key="dist_km">km</option>
                            </select>
                        </div>
                    </div>
                </div>
            </>,
            "duration": <>
                <label className="label">Dauer</label>
                <div className="columns">
                    <div className="column">
                        <div className="field">
                            <div className="control has-icons-right">
                                <input
                                    className={`input ${this.state.durationClass}`}
                                    type="number"
                                    name="duration"
                                    placeholder="Gebe hier die Dauer der Aktivität ein"
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
                            <select name="durationMul" onChange={this.handleChange} value={this.state.durationMul}>
                                <option value="1" key="dur_s">sec</option>
                                <option value="60" key="dur_m">min</option>
                                <option value="3600" key="dur_h">h</option>
                            </select>
                        </div>
                    </div>
                </div>
            </>,
            "pace": <>
                <label className="label">Placeholder für Pace -&gt; Wird berechnet?</label>
            </>,
            "heartRate": <>
                <label className="label">Herzrate</label>
                <div className="columns">
                    <div className="column is-full">
                        <input
                            className="input"
                            type="number"
                            name="heartRate"
                            placeholder="Gebe hier deine durchschnittliche Herzrate ein"
                            value={Number(this.state.heartRate) === 0 ? "" : this.state.heartRate}
                            onChange={this.handleChange}
                        />
                        <span className={`icon is-right ${this.state.heartRateIconClass}`}>
                            <FontAwesomeIcon icon={this.state.heartRateIcon}/>
                        </span>
                    </div>
                </div>
            </>,
            "altitude": <>
                <label className="label">Höhenmeter</label>
                <div className="field">
                    <div className="control has-icons-right">
                        <input
                            className={`input ${this.state.altitudeClass}`}
                            type="number"
                            name="altitude"
                            placeholder="Gebe hier deine Höhenmeter ein"
                            value={Number(this.state.altitude) === 0 ? "" : this.state.altitude}
                            onChange={this.handleChange}
                        />
                        <span className={`icon is-right ${this.state.altitudeClass}`}>
                            <FontAwesomeIcon icon={this.state.altitudeIcon}/>
                        </span>
                    </div>
                </div>
            </>
        };

        if (this.state.sportClass === "is-success") {
            // Get bitfields and split them into their bitwise representation
            // reverse to fill zeros in the beginning
            let bitfieldArray: any = this.props.sports[this.state.sport];
            let must: boolean[] = bitfieldArray[1].toString(2).split("").reverse();
            let optional: boolean[] = bitfieldArray[0].toString(2).split("").reverse();

            // Fill missing zeros
            for (let i = 0; i < NUM_FIELDS - must.length; i++) {
                must.push(false);
            }

            for (let i = 0; i < NUM_FIELDS - optional.length; i++) {
                optional.push(false);
            }

            // reverse back
            must = must.reverse();
            optional = optional.reverse();

            let fieldsHTML = [<div className="divider">Plichtangaben</div>];
            for (let index in must) {
                must[index] = Boolean(Number(must[index]));

                if (must[index]) {
                    fieldsHTML.push(this.HTMLFields[inputFields[index]]);
                }
            }

            // Update must params
            this.mustParams = must;

            // TODO: Only have optional params that arent in must

            fieldsHTML.push(<div className="divider">Optional</div>);
            for (let index in optional) {
                optional[index] = Boolean(Number(optional[index]));

                if (optional[index]) {
                    //fieldsHTML.push(this.HTMLFields[inputFields[index]]);
                }
            }

            return fieldsHTML;
        }
        return <p>Bitte wähle eine Sportart aus.</p>;
    }

    validateInput() {
        let valid = false;

        if (this.mustParams.length === NUM_FIELDS) {
            valid = this.isValid("sport", this.state.sport);

            for (let i = 0; i < NUM_FIELDS; ++i) {
                if (this.mustParams[i]) {
                    let param = inputFields[i];
                    valid = valid && this.isValid(param, this.state[param]);
                }
            }
        }

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
