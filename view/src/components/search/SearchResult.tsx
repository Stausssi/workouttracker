import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Link} from "react-router-dom";
import {faCheck, faBan, faUserPlus, faUserMinus, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";
import SessionHandler from "../../utilities/SessionHandler";
import {BACKEND_URL} from "../../App";
import {IconDefinition} from "@fortawesome/free-brands-svg-icons";

interface Props {
    username: string
}

interface State {
    isFollowing: boolean
    icon: IconDefinition,
    buttonClass: string
    disableButton: boolean
}

export default class SearchResult extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isFollowing: false,
            icon: faUserPlus,
            buttonClass: "is-success",
            disableButton: SessionHandler.getUsername() === this.props.username
        }

        // Check whether the user is already following or blocked
        fetch(BACKEND_URL + "users/getRelationship?user=" + this.props.username, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: SessionHandler.getAuthToken()
            }
        }).then((response) => {
            if (response.ok) {
                return response.json().then((response) => {
                    let isFollowing: boolean = response.following;
                    let isBlocked: boolean = response.blocked;

                    this.setState({
                        isFollowing: isFollowing,
                        icon: (isBlocked ? faBan : (isFollowing ? faCheck : faUserPlus)),
                        buttonClass: (isBlocked ? "is-danger" : this.state.buttonClass),
                        disableButton: this.state.disableButton || isBlocked,
                    });
                });
            }
        });

        this.followUser = this.followUser.bind(this);
        this.unfollowUser = this.unfollowUser.bind(this);
        this.updateIcon = this.updateIcon.bind(this);
    }

    scrollInputContent(event: any) {
        const target = event.target;

        target.scrollBy({
            left: (event.type === "mouseout" ? -target.scrollWidth : target.scrollWidth),
            behavior: "smooth"
        });
    }

    followUser(event: any) {
        if (!this.state.disableButton) {
            fetch(BACKEND_URL + "users/follow", {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: SessionHandler.getAuthToken()
                },
                body: JSON.stringify({
                    followed: this.props.username
                })
            }).then((response) => {
                this.setState({
                    isFollowing: response.ok,
                    icon: response.ok ? faUserMinus : faExclamationTriangle,
                    buttonClass: "is-danger"
                });
            });
        }
    }

    unfollowUser(event: any) {
        if (!this.state.disableButton) {
            fetch(BACKEND_URL + "users/unfollow", {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: SessionHandler.getAuthToken()
                },
                body: JSON.stringify({
                    unfollowed: this.props.username
                })
            }).then((response) => {
                this.setState({
                    isFollowing: !response.ok,
                    icon: response.ok ? faUserPlus : faExclamationTriangle,
                    buttonClass: response.ok ? "is-success" : "is-danger"
                });
            });
        }
    }

    updateIcon(event: any) {
        if (!this.state.disableButton) {
            let following: boolean = this.state.isFollowing;
            let mouseOver: boolean = event.type === "mouseenter";

            this.setState({
                icon: following ? (mouseOver ? faUserMinus : faCheck) : this.state.icon,
                buttonClass: (following ? (mouseOver ? "is-danger" : "is-success") : this.state.buttonClass)
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
                            onClick={this.state.isFollowing ? this.unfollowUser : this.followUser}
                            onMouseEnter={this.updateIcon}
                            onMouseLeave={this.updateIcon}
                            onMouseDown={(e) => e.preventDefault()}
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