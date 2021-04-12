import React, {Component} from "react";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import DatePicker, {registerLocale, setDefaultLocale} from "react-datepicker";
import de from "date-fns/locale/de";
import "react-datepicker/dist/react-datepicker.css";

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
    averageHeartRate: 0,
    averageHeartRateClass: "",
    averageHeartRateIcon: faTimes,
    averageHeartRateIconClass: "",
    altitudeDifference: 0,
    altitudeDifferenceClass: "",
    altitudeDifferenceIcon: faTimes,
    altitudeDifferenceIconClass: "",
    date: new Date()
}

const defaultNotifyState = {
    notifyMessage: "",
    notifyType: ""
}

const defaultStates: any[] = [defaultActivityState, defaultNotifyState];
const defaultState = Object.assign({}, defaultActivityState, defaultNotifyState);

// represents [min, max] values for the corresponding input field
const validValues: { [key: string]: any[] } = {
    "sport": [0, null],
    "duration": [0, null],
    "distance": [0, null],
    "pace": [0, null],
    "averageHeartRate": [25, 250],
    "altitudeDifference": [0, null]
}

const hasIcon: string[] = ["duration", "distance", "averageHeartRate", "altitudeDifference"];

enum RESET_TYPES {
    ACTIVITY,
    NOTIFICATION
}

const tryAgainLater = "Please try again later and contact an administrator.";
const notifyMessages: { [ident: string]: [message: string, type: string] } = {
    "fetchFailed":
        ["No sports found!<br />" + tryAgainLater, "is-danger"],
    "success":
        ["Your activity was saved successfully ", "is-success"],
    "error":
        ["Something went wrong!<br />" + tryAgainLater, "is-danger"],
    "unknownUser":
        ["Your username wasn't found!<br />Please log-in or contact an administrator if you believe this is an error.", "is-danger"]
}

const NUM_FIELDS = 5;
const inputFields: string[] = ["distance", "duration", "pace", "averageHeartRate", "altitudeDifference"];

export default class AddActivity extends Component<Props, State> {
    HTMLFields: { [field: string]: JSX.Element; } | undefined;
    mandatoryParams: boolean[] = [];
    optParams: boolean[] = [];

    constructor(props: Props) {
        super(props);
        this.state = Object.assign({}, defaultState);

        // bind this to event handlers
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    componentDidMount() {
        let submit = document.getElementById("submit-activity");
        if (submit) {
            this.setState({submitButton: submit});
        }
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
                this.mandatoryParams = [];
                this.optParams = [];
            }
        }
    }

    handleChange(event: any) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        // ignore negative values
        if (value < 0) {
            return;
        }

        // Check whether the property has a range of values
        if (Object.keys(validValues).includes(name)) {
            let valid = this.isValid(name, value);
            let icon = hasIcon.includes(name);

            this.setState({[name + "Class"]: valid ? "is-success" : ""});

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
        } else {
            // Check if a multiplier was changed
            if (name.includes("Mul")) {
                // Calculate property depending on multiplier
                let multiplyWith = this.state[name] / value;
                let param = name.replace("Mul", "");
                this.setState({[param]: this.state[param] * multiplyWith})
            }
        }

        // Update state
        isNaN(value) ?
            this.setState({[name]: value}) :
            this.setState({[name]: Number(value)});
    }

    handleSubmit(event: any) {
        // Prevent page refresh
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
            for (let index in this.mandatoryParams) {
                let key = inputFields[index];
                let value = this.state[key];

                if (this.mandatoryParams[index] || (this.optParams[index] && this.isValid(key, value))) {
                    // Apply multiplier
                    let mul = this.state[key + "Mul"];
                    if (mul > 1) {
                        value *= mul;
                    }

                    bodyContent = Object.assign({}, bodyContent, {[key]: value});
                }
            }

            // Filter date
            if (this.state.date < this.getMaxValidDate()) {
                bodyContent = Object.assign({}, bodyContent, {startedAt: this.state.date.toISOString().slice(0, 19).replace("T", " ")});
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
                    this.setState({
                        notifyMessage: notifyMessages["success"][0],
                        notifyType: notifyMessages["success"][1]
                    });

                    // Disable submit button and reset form
                    this.allowSubmit(false);
                    this.resetState(RESET_TYPES.ACTIVITY);
                } else {
                    return response.json().then((response) => {
                        response.errno === 1 ?
                            this.setState({
                                notifyMessage: notifyMessages["unknownUser"][0],
                                notifyType: notifyMessages["unknownUser"][1]
                            }) :
                            this.setState({
                                notifyMessage: notifyMessages["error"][0],
                                notifyType: notifyMessages["error"][1]
                            });
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
        this.validateInput();
        return (
            <form onSubmit={this.handleSubmit} onReset={this.handleReset}>
                <NotificationBox message={this.state.notifyMessage} type={this.state.notifyType} hasDelete={false}/>

                <label className="label">Sport</label>
                <div className={`select is-fullwidth mb-5 ${this.state.sportClass}`}>
                    <select name="sport" onChange={this.handleChange} value={this.state.sport}>
                        {
                            this.state.notifyMessage !== notifyMessages["fetchFailed"][0] ?
                                this.createSportSelect() :
                                <option key="-1" value="-1">Something went wrong!</option>
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
        // Create HTML Fields template
        // Executed on the client -> no performance problem for now
        // TODO: Fix 'Each child in a list should have a unique "key" prop.' warning
        this.HTMLFields = {
            "distance": <>
                <label className="label">Distance</label>
                <div className="field has-addons">
                    <div className="control has-icons-right is-expanded">
                        <input
                            className={`input ${this.state.distanceClass}`}
                            type="number"
                            name="distance"
                            placeholder="Please enter the covered distance"
                            value={Number(this.state.distance) === 0 ? "" : this.state.distance}
                            onChange={this.handleChange}
                        />
                        <span className={`icon is-right ${this.state.distanceIconClass}`}>
                            <FontAwesomeIcon icon={this.state.distanceIcon}/>
                        </span>
                    </div>
                    <div className="control">
                        <div className="select">
                            <select
                                className="select"
                                name="distanceMul"
                                value={this.state.distanceMul}
                                onChange={this.handleChange}
                            >
                                <option value="1" key="dist_m">m</option>
                                <option value="1000" key="dist_km">km</option>
                            </select>
                        </div>
                    </div>
                </div>
            </>,
            "duration": <>
                <label className="label">Duration</label>
                <div className="field has-addons">
                    <div className="control has-icons-right is-expanded">
                        <input
                            className={`input ${this.state.durationClass}`}
                            type="number"
                            name="duration"
                            placeholder="Please enter the duration of the activity"
                            value={Number(this.state.duration) === 0 ? "" : this.state.duration}
                            onChange={this.handleChange}
                        />
                        <span className={`icon is-right ${this.state.durationIconClass}`}>
                            <FontAwesomeIcon icon={this.state.durationIcon}/>
                        </span>
                    </div>
                    <div className="control">
                        <div className="select is-fullwidth">
                            <select
                                className="select"
                                name="durationMul"
                                value={this.state.durationMul}
                                onChange={this.handleChange}
                            >
                                <option value="1" key="dur_s">s</option>
                                <option value="60" key="dur_m">m</option>
                                <option value="3600" key="dur_h">h</option>
                            </select>
                        </div>
                    </div>
                </div>
            </>,
            "pace": <></>,
            "averageHeartRate": <>
                <label className="label">Heart rate</label>
                <div className="field">
                    <div className="control has-icons-right">
                        <input
                            className={`input ${this.state.averageHeartRateClass}`}
                            type="number"
                            name="averageHeartRate"
                            placeholder="Please insert your average heart rate"
                            value={Number(this.state.averageHeartRate) === 0 ? "" : this.state.averageHeartRate}
                            onChange={this.handleChange}
                        />
                        <span className={`icon is-right ${this.state.averageHeartRateIconClass}`}>
                            <FontAwesomeIcon icon={this.state.averageHeartRateIcon}/>
                        </span>
                    </div>
                </div>
            </>,
            "altitudeDifference": <>
                <label className="label">Altitude difference</label>
                <div className="field has-addons">
                    <div className="control has-icons-right is-expanded">
                        <input
                            className={`input ${this.state.altitudeDifferenceClass}`}
                            type="number"
                            name="altitudeDifference"
                            placeholder="Please enter the altitude difference"
                            value={Number(this.state.altitudeDifference) === 0 ? "" : this.state.altitudeDifference}
                            onChange={this.handleChange}
                        />
                        <span className={`icon is-right ${this.state.altitudeDifferenceClass}`}>
                            <FontAwesomeIcon icon={this.state.altitudeDifferenceIcon}/>
                        </span>
                    </div>
                    <div className="control">
                        <div className="select">
                            <select
                                className="select"
                                name="altitudeDifferenceMul"
                                value={this.state.distanceMul}
                                onChange={this.handleChange}
                            >
                                <option value="1" key="alt_m">m</option>
                                <option value="1000" key="alt_km">km</option>
                            </select>
                        </div>
                    </div>
                </div>
            </>,
            "date": <>
                <label className="label">Date and Time</label>
                <DatePicker
                    dateFormat="dd.MM.yyyy HH:mm"
                    showTimeSelect
                    timeIntervals={15}
                    timeFormat="HH:mm"
                    maxDate={this.getMaxValidDate()}
                    selected={this.state.date}
                    locale={de}
                    onChange={(date) => this.setState({date: date})}
                    filterTime={(time) => {
                        let maxTime = this.getMaxValidDate();
                        let selected = new Date(this.state.date);
                        selected.setHours(time.getHours());
                        selected.setMinutes(time.getMinutes());

                        return selected < maxTime;
                    }}
                    inline
                />
            </>
        };

        if (this.state.sportClass === "is-success") {
            // Get bitfields and split them into their bitwise representation
            // reverse to fill zeros in the beginning
            let bitfieldArray: any = this.props.sports[this.state.sport];
            let mandatory: boolean[] = bitfieldArray[1].toString(2).split("").reverse();
            let optional: boolean[] = bitfieldArray[0].toString(2).split("").reverse();

            // Fill missing zeros
            for (let i = 0; i < NUM_FIELDS - mandatory.length; i++) {
                mandatory.push(false);
            }

            for (let i = 0; i < NUM_FIELDS - optional.length; i++) {
                optional.push(false);
            }

            // reverse back
            mandatory = mandatory.reverse();
            optional = optional.reverse();

            let fieldsHTML = [<div className="divider">Mandatory</div>];
            for (let index in mandatory) {
                mandatory[index] = Boolean(Number(mandatory[index]));
                optional[index] = Boolean(Number(optional[index]));

                if (mandatory[index]) {
                    fieldsHTML.push(this.HTMLFields[inputFields[index]]);

                    // Remove param from optional to prevent double input
                    if (optional[index]) {
                        optional[index] = false;
                    }
                }
            }

            // Update global params
            this.mandatoryParams = mandatory;
            this.optParams = optional;

            // Only display optional params if there are any
            if (optional.includes(true)) {
                fieldsHTML.push(<br/>);
                fieldsHTML.push(<div className="divider">Optional</div>);

                for (let index in optional) {
                    if (optional[index]) {
                        fieldsHTML.push(this.HTMLFields[inputFields[index]]);
                    }
                }
            }

            fieldsHTML.push(this.HTMLFields["date"]);

            return fieldsHTML;
        }
        return <p className="tag is-info is-light">Please select a sport</p>;
    }

    validateInput(returnValue?: boolean) {
        let valid = false;

        if (this.mandatoryParams.length === NUM_FIELDS) {
            valid = this.isValid("sport", this.state.sport);

            for (let i = 0; i < NUM_FIELDS; ++i) {
                if (this.mandatoryParams[i]) {
                    let param = inputFields[i];
                    valid = valid && this.isValid(param, this.state[param]);
                }
            }
        }

        if (this.state.submitButton) {
            this.allowSubmit(valid);
        }

        if (returnValue) {
            return valid;
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

    getMaxValidDate() {
        return new Date(Date.now() - this.state.duration * this.state.durationMul * 1000);
    }
}