import {faPlusCircle, faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import ActivityForm from "./ActivityForm";
import {BACKEND_URL} from "../../App";
import SessionHandler from "../../utilities/SessionHandler";

interface Props {
}

interface State {
    showPopup: boolean
    active: boolean
    sports: { [name: string]: number }
}

export default class ActivityModal extends React.Component<Props, State> {
    private readonly abortController: AbortController;

    constructor(props: Props) {
        super(props);
        this.state = {
            showPopup: false,
            active: false,
            sports: {}
        };

        this.abortController = new AbortController();
    }

    componentDidMount() {
        let submit = document.getElementById("submit-activity");
        if (submit) {
            submit.setAttribute("disabled", "");
        }
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    toggleActive() {
        let active = !this.state.active;
        this.setState({active: active});

        if (active) {
            // Fetch sports from database
            fetch(BACKEND_URL + "sports/fetch", {
                method: "GET",
                headers: {
                    Accepts: "application/json",
                    Authorization: SessionHandler.getAuthToken()
                },
                signal: this.abortController.signal
            }).then((response) => {
                if (response.ok) {
                    return response.json().then((response) => {
                        this.setState({sports: JSON.parse(response.body)});
                    });
                } else {
                    return response.json().then((response) => {
                        console.log("Sport Fetch failed:", response);
                        this.setState({sports: {}});
                    });
                }
            }).catch((error: any) => {
                if (error.name !== "AbortError") {
                    console.log("Fetch failed:", error);
                }
            });
        } else {
            // Reset input form on close
            document.forms[0].reset()
        }
    };

    render() {
        return (
            <section className='main'>
                <div className={`modal ${this.state.active ? "is-active" : ""}`}>
                    <div className="modal-background"/>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Add Activity</p>
                            <button className="delete" aria-label="close" onClick={() => this.toggleActive()}/>
                        </header>

                        <section className="modal-card-body">
                            <div className="content">
                                <ActivityForm sports={this.state.sports}/>
                            </div>
                        </section>

                        <footer className="modal-card-foot">
                            <button className="button is-success" id="submit-activity"
                                    onClick={() => document.forms[0].requestSubmit()}>
                                <span className="icon is-small">
                                    <FontAwesomeIcon icon={faCheck}/>
                                </span>
                                <span>Save</span>
                            </button>
                            <button className="button is-danger is-outlined" onClick={() => this.toggleActive()}>
                                <span className="icon is-small">
                                    <FontAwesomeIcon icon={faTimes}/>
                                </span>
                                <span>Cancel</span>
                            </button>
                        </footer>
                    </div>
                </div>

                <button className="button is-primary is-rounded" onClick={() => this.toggleActive()}>
                    <span className="icon">
                        <FontAwesomeIcon icon={faPlusCircle}/>
                    </span>
                </button>
            </section>
        );
    }
}
  