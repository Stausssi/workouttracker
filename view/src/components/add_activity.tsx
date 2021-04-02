import React, {Component} from "react";
import NotificationBox from "./notificationBox";

interface Props {

}

interface State {
    activityID: number
    duration: number
    durationMul: number
    distance: number
    distanceMul: number
    heartRate: number
    notifyMessage: string
    notifyType: string
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
                submit.removeAttribute("disabled");
            } else {
                submit.setAttribute("disabled", "");
            }
        }
        return valid;
    }

    handleSubmit(event: any) {
        event.preventDefault();
        this.setState({notifyMessage: "Activity submitted", notifyType: "is-success"});
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <NotificationBox message={this.state.notifyMessage} type={this.state.notifyType}/>

                <label className="label">Art der Aktivität</label>
                <div className="select is-fullwidth mb-5">
                    <select name="activityList" onChange={this.handleChange} defaultValue="0">
                        <option value="0" />
                        <option value="1">Testsportart</option>
                    </select>
                </div>

                <label className="label">Dauer</label>
                <div className="columns">
                    <div className="column">
                        <input
                            className="input"
                            type="number"
                            name="duration"
                            placeholder="Gebe hier die Dauer der Aktivität an"
                            value={this.state.duration === 0 ? "" : this.state.duration}
                            onChange={this.handleChange}
                        />
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
                        <input
                            className="input"
                            type="number"
                            name="distance"
                            placeholder="Gebe hier die zurückgelegte Distanz an"
                            value={this.state.distance === 0 ? "" : this.state.distance}
                            onChange={this.handleChange}
                        />
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
                    </div>
                </div>
            </form>
        );
    }
}
