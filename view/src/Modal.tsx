import {faPlusCircle, faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import AddActivity from "./components/add_activity";

interface Props {}

interface State {
    showPopup: boolean
    active: boolean
    sports: { [name: string]: number }
}

export default class Modal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showPopup: false,
            active: false,
            sports: {}
        };
    }

    componentDidMount() {
        let submit = document.getElementById("submit-activity");
        if (submit) {
            submit.setAttribute("disabled", "");
        }
    }

    toggleActive() {
        let active = !this.state.active;
        this.setState({active: active});

        if (active) {
            // Fetch activities from database
            fetch("http://localhost:9000/backend/sports/fetch").then((response) => {
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
                                <AddActivity sports={this.state.sports}/>
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
  
  

