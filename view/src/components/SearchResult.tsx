import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {faUserPlus} from "@fortawesome/free-solid-svg-icons";

interface Props {
    username: string
}

interface State {}

export default class SearchResult extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

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
        console.log(`Friend with username ${this.props.username} added!`);
    }

    render() {
        return (
            <>
            <div className="dropdown-item">
                <div className="field has-addons">
                    <div className="control">
                        <input
                            className="input is-static"
                            type="text"
                            value={this.props.username}
                            readOnly={true}
                            onMouseOver={this.scrollInputContent}
                            onMouseOut={this.scrollInputContent}
                        />
                    </div>
                    <div className="control">
                        <button className="button is-success is-inverted is-small" onClick={this.addFriend}>
                            <span className="icon">
                                <FontAwesomeIcon icon={faUserPlus} aria-hidden={"true"}/>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
    </>
    )
        ;
    }
}