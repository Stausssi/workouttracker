import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";

import DatePicker from "react-datepicker";
import en from "date-fns/locale/en-GB";
import "react-datepicker/dist/react-datepicker.css";

import NotificationBox from "../notificationBox";
import SessionHandler from "../../utilities/SessionHandler";

import {BACKEND_URL} from "../../App";

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
    distanceMul: 1,
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

interface selectOptions {
    [key: string]: [value: number, text: string]
}

interface inputConfig {
    identifier: string,
    validValues: [min: any, max: any],
    hasIcon: boolean,
    inputLabel?: string,
    inputType?: string,
    inputPlaceholder?: string,
    multiplier?: selectOptions
}

const inputFields: inputConfig[] = [
    {
        identifier: "distance",
        validValues: [0, null],
        hasIcon: true,
        inputLabel: "Distance",
        inputType: "number",
        inputPlaceholder: "Please enter the covered distance",
        multiplier: {
            "dist_m": [1, "m"],
            "dist_km": [1000, "km"]
        }
    },
    {
        identifier: "duration",
        validValues: [0, null],
        hasIcon: true,
        inputLabel: "Duration",
        inputType: "number",
        inputPlaceholder: "Please enter the duration of the activity",
        multiplier: {
            "dur_s": [1, "s"],
            "dur_m": [60, "m"],
            "dur_h": [3600, "h"]
        }
    },
    {
        identifier: "pace",
        validValues: [0, null],
        hasIcon: false
    },
    {
        identifier: "averageHeartRate",
        validValues: [25, 250],
        hasIcon: true,
        inputLabel: "Heart Rate",
        inputType: "number",
        inputPlaceholder: "Please insert your average heart rate"
    },
    {
        identifier: "altitudeDifference",
        validValues: [0, null],
        hasIcon: true,
        inputLabel: "Altitude Difference",
        inputType: "number",
        inputPlaceholder: "Please enter the altitude difference of the activity",
        multiplier: {
            "alt_m": [1, "m"],
            "alt_km": [1000, "km"]
        }
    },
    /*
     * !! IT'S IMPORTANT TO LEAVE SPORTS AS THE LAST ENTRY IN THIS LIST !!
     */
    {
        identifier: "sport",
        validValues: [0, null],
        hasIcon: false
    }
];
const NUM_FIELDS = inputFields.length - 1;

export default class AddActivity extends Component<Props, State> {
    mandatoryParams: boolean[] = [];
    optParams: boolean[] = [];

    constructor(props: Props) {
        super(props);
        // Use Object.assign to copy the defaultState and prevent changes to default values
        this.state = Object.assign({}, defaultState);

        // bind this to event handlers
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    componentDidMount() {
        // Find submit button of the Modal
        let submit = document.getElementById("submit-activity");
        if (submit) {
            this.setState({submitButton: submit});
        }
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        // Check for prop changes
        if (prevProps.sports !== this.props.sports) {
            // Display warning if sports couldn't be fetched
            if (Object.keys(this.props.sports).length === 0) {
                this.setState({
                    notifyMessage: notifyMessages["fetchFailed"][0],
                    notifyType: notifyMessages["fetchFailed"][1]
                });
            }
        }

        // Check for state changes
        if (prevState.sport !== this.state.sports) {
            // Reset params if sport was deselected
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

        // Retrieve params
        let inputParams = null;
        for (let index in inputFields) {
            let inputIndex = inputFields[index];
            if (inputIndex.identifier === name) {
                inputParams = inputIndex;
                break;
            }
        }

        // Check whether the property has inputParams
        if (inputParams) {
            let valid = this.isValid(value, inputParams.validValues);
            let icon = inputParams.hasIcon;

            this.setState({[name + "Class"]: (valid ? "is-success" : "")});

            if (icon) {
                this.setState({
                    [name + "Icon"]: (valid ? faCheck : faTimes),
                    [name + "IconClass"]: (valid ? "has-text-success" : "")
                });
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
                let inputParams = inputFields[index];
                let value = this.state[inputParams.identifier];

                if (this.mandatoryParams[index] || (this.optParams[index] && this.isValid(value, inputParams.validValues))) {
                    // Apply multiplier
                    let mul = this.state[inputParams.identifier + "Mul"];
                    if (mul > 1) {
                        value *= mul;
                    }

                    bodyContent[inputParams.identifier] = value;
                }
            }

            // Calculate pace
            if (bodyContent["distance"] > 0 && bodyContent["duration"] > 0) {
                // Distance is in m, duration in s
                // Pace will be saved in km/h
                bodyContent["pace"] = bodyContent["distance"] / bodyContent["duration"] * 3.6;
            }

            // Check if date is valid, else use max valid date
            bodyContent.startedAt =
                (this.state.date < this.getMaxValidDate() ?
                        this.state.date :
                        this.getMaxValidDate()
                ).toISOString().slice(0, 19).replace("T", " ");

            // Send post request
            fetch(BACKEND_URL + "activity/add", {
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
                <div className={`select is-fullwidth ${this.state.sportClass}`}>
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
        let createInputField = (params: inputConfig) => {
            function createSelectOptions(dict: selectOptions) {
                let options = [];
                for (let key in dict) {
                    if (dict.hasOwnProperty(key)) {
                        options.push(<option value={dict[key][0]} key={key}>{dict[key][1]}</option>);
                    }
                }

                return options;
            }

            let identifier = params.identifier;

            // Pace doesn't have an input field
            if (identifier !== "pace") {
                return (
                    params.multiplier ?
                        <div key={"inputField_" + identifier} className="field">
                            <label className="label">{params.inputLabel}</label>
                            <div className="field has-addons">
                                <div className="control has-icons-right is-expanded">
                                    <input
                                        className={`input ${this.state[identifier + "Class"]}`}
                                        type={params.inputType}
                                        name={identifier}
                                        placeholder={params.inputPlaceholder}
                                        value={Number(this.state[identifier]) === 0 ? "" : this.state[identifier]}
                                        onChange={this.handleChange}
                                    />
                                    <span className={`icon is-right ${this.state[identifier + "IconClass"]}`}>
                                    <FontAwesomeIcon icon={this.state[identifier + "Icon"]}/>
                                </span>
                                </div>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select
                                            className="select"
                                            name={identifier + "Mul"}
                                            value={this.state[identifier + "Mul"]}
                                            onChange={this.handleChange}
                                        >
                                            {createSelectOptions(params.multiplier)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div key={"inputField_" + identifier} className="field">
                            <label className="label">{params.inputLabel}</label>
                            <div className="field">
                                <div className="control has-icons-right">
                                    <input
                                        className={`input ${this.state[identifier + "Class"]}`}
                                        type={params.inputType}
                                        name={identifier}
                                        placeholder={params.inputPlaceholder}
                                        value={Number(this.state[identifier]) === 0 ? "" : this.state[identifier]}
                                        onChange={this.handleChange}
                                    />
                                    <span className={`icon is-right ${this.state[identifier + "IconClass"]}`}>
                                    <FontAwesomeIcon icon={this.state[identifier + "Icon"]}/>
                                </span>
                                </div>
                            </div>
                        </div>
                );
            } else {
                return (
                    <div key={"input_empty_div"}/>
                );
            }
        };

        // Only create elements if a valid sport is selected
        if (this.state.sportClass === "is-success") {
            // Get bitfields
            let bitfieldArray: any = this.props.sports[this.state.sport];

            // split them into their bitwise representation
            // map the strings representing numbers to booleans
            // reverse to fill zeros in the beginning
            let mandatory: boolean[] = bitfieldArray[1].toString(2)
                .split("").map((value: string) => Boolean(Number(value)))
                .reverse();
            let optional: boolean[] = bitfieldArray[0].toString(2)
                .split("").map((value: string) => Boolean(Number(value)))
                .reverse();

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

            let fieldsHTML: JSX.Element[] = [];
            if (mandatory.includes(true)) {
                fieldsHTML = [<div className="divider" key={"input_divider_man"}>Mandatory</div>];
                for (let index in mandatory) {
                    if (mandatory[index]) {
                        fieldsHTML.push(createInputField(inputFields[index]));

                        // Remove param from optional to prevent double input
                        if (optional[index]) {
                            optional[index] = false;
                        }
                    }
                }
            }

            // Update global params
            this.mandatoryParams = mandatory;
            this.optParams = optional;

            // Only display optional params if there are any
            if (optional.includes(true)) {
                fieldsHTML.push(<div className="divider" key={"input_divider_opt"}>Optional</div>);

                for (let index in optional) {
                    if (optional[index]) {
                        fieldsHTML.push(createInputField(inputFields[index]));
                    }
                }
            }

            // Create date picker
            fieldsHTML.push(<div key={"inputField_date"}>
                <label className="label">Date and Time</label>
                <DatePicker
                    dateFormat="dd.MM.yyyy HH:mm"
                    showTimeSelect
                    timeIntervals={15}
                    timeFormat="HH:mm"
                    maxDate={this.getMaxValidDate()}
                    selected={this.state.date}
                    locale={en}
                    onChange={(date: Date) => this.setState({date: date})}
                    filterTime={(time: Date) => {
                        let maxTime = this.getMaxValidDate();
                        let selected = new Date(this.state.date);
                        selected.setHours(time.getHours());
                        selected.setMinutes(time.getMinutes());

                        return selected < maxTime;
                    }}
                    inline
                />
            </div>);

            return fieldsHTML;
        }
        return <p className="tag is-info is-light" key={"inputField_sportInfo"}>Please select a sport</p>;
    }

    validateInput(returnValue?: boolean) {
        let valid = false;
        if (this.mandatoryParams.length === NUM_FIELDS) {
            valid = this.isValid(this.state.sport, inputFields[NUM_FIELDS].validValues);

            for (let index in this.mandatoryParams) {
                if (this.mandatoryParams[index]) {
                    let inputParams = inputFields[index];
                    valid = valid && this.isValid(this.state[inputParams.identifier], inputParams.validValues);
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

    isValid(value: number, validValues: any[]) {
        let min = validValues[0];
        let max = validValues[1];
        value = Number(value);

        // Check whether the value is in range of the params or is NaN (sports)
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