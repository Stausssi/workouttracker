import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Link} from "react-router-dom";
import {faCheck, faUserSlash, faUserPlus, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import SessionHandler from "../../utilities/SessionHandler";
import {BACKEND_URL} from "../../App";
import {IconDefinition} from "@fortawesome/free-brands-svg-icons";

interface Props {
    username: string
}

interface State {
    icon: IconDefinition,
    buttonClass: string
    disableButton: boolean
}

export default class SearchResult extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            icon: faUserPlus,
            buttonClass: "is-success",
            disableButton: SessionHandler.getUsername() === this.props.username
        }

        // Check whether the users are already friends or blocked
        fetch(BACKEND_URL + "users/getFriendship", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: SessionHandler.getAuthToken()
            },
            body: JSON.stringify({
                username: this.props.username
            })
        }).then((response) => {
            if (response.ok) {
                return response.json().then((response) => {
                    let befriended: boolean = response.befriended;
                    let blocked: boolean = response.blocked;

                    this.setState({
                        icon: (blocked ? faUserSlash : (befriended ? faCheck : faUserPlus)),
                        buttonClass: (blocked ? "is-danger" : this.state.buttonClass),
                        disableButton: this.state.disableButton || befriended || blocked
                    });
                });
            }
        });

        this.addFriend = this.addFriend.bind(this);
    }

    scrollInputContent(event: any) {
        const target = event.target;

        target.scrollBy({
            left: (event.type === "mouseout" ? -target.scrollWidth : target.scrollWidth),
            behavior: "smooth"
        });
    }

    addFriend(event: any) {
        if (!this.state.disableButton) {
            fetch(BACKEND_URL + "users/addFriend", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: SessionHandler.getAuthToken()
                },
                body: JSON.stringify({
                    follower: SessionHandler.getUsername(),
                    followed: this.props.username
                })
            }).then((response) => {
                // Change icon to checkmark if succeeded or red exclamation triangle if failed
                this.setState({
                    icon: response.ok ? faCheck : faExclamationTriangle,
                    buttonClass: response.ok ? "is-success" : "is-danger",
                    disableButton: true
                });
            });
        }
    }

    render() {
        return (
            <div className="dropdown-item">
                <div className="field has-addons">
                    <div className="control">
                        <Link to={"/users/" + this.props.username}>
                            <input
                                className="input is-static"
                                type="text"
                                value={this.props.username}
                                readOnly={true}
                                onMouseOver={this.scrollInputContent}
                                onMouseOut={this.scrollInputContent}
                            />
                        </Link>
                    </div>
                    <div className="control">
                        <button
                            className={`button ${this.state.buttonClass} is-inverted`}
                            onClick={this.addFriend}
                            disabled={this.state.disableButton}
                        >
                                <span className="icon is-small">
                                    <FontAwesomeIcon icon={this.state.icon}/>
                                </span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}