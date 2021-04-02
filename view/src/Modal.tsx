import {faPlusCircle, faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {ReactNode} from "react";
import AddActivity from "./components/add_activity";

interface Props {
    children: ReactNode;
}

interface State {
    showPopup: boolean
    active: boolean
    allowSubmit: boolean
}

export default class Modal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showPopup: false,
            active: false,
            allowSubmit: false
        };
    }

    componentDidMount() {
        let submit = document.getElementById("submit-activity");
        if (submit) {
            submit.setAttribute("disabled", "");
        }
    }

    toggleActive = () => {
        this.setState((state) => ({active: !state.active}))
    };

    render() {
        const active = this.state.active ? "is-active" : "";
        return (
            <section className='main'>
                <div className={`modal ${active}`}>
                    <div className="modal-background"/>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Aktivität hinzufügen</p>
                            <button className="delete" aria-label="close" onClick={() => this.toggleActive()}/>
                        </header>
                        <section className="modal-card-body">
                            <div className="content">
                                <AddActivity />
                            </div>
                        </section>
                        <footer className="modal-card-foot">
                            <button className="button is-success" id="submit-activity" onClick={() => document.forms[0].requestSubmit()}>
                                <span className="icon is-small">
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                                <span>Speichern</span>
                            </button>
                            <button className="button is-danger is-outlined" onClick={() => this.toggleActive()}>
                                <span className="icon is-small">
                                    <FontAwesomeIcon icon={faTimes} />
                                </span>
                                <span>Abbrechen</span>
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
  
  

