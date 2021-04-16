import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import SearchResult from "./SearchResult";
import {BACKEND_URL} from "../../App";
import SessionHandler from "../../utilities/SessionHandler";
import NotificationBox from "../NotificationBox";

interface Props {
}

interface State {
    searchQuery: string
    searchResults: JSX.Element;
    displayLoading: boolean
}

export default class SearchBar extends React.Component<Props, State> {
    private searchDelay: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            searchQuery: "",
            searchResults: <></>,
            displayLoading: false
        }

        this.updateSearch = this.updateSearch.bind(this);
    }

    updateSearch(event: any) {
        let value: string = String(event.target.value).replaceAll(" ", "");

        this.setState({
                searchQuery: value,
                searchResults: <></>,
                displayLoading: true
            }, () => {
                // TODO: Input filtering
                clearTimeout(this.searchDelay);

                if (value !== "") {
                    this.searchDelay = setTimeout(() => {
                        this.searchFor(value);
                    }, 1000);
                }
            }
        );
    }

    searchFor(query: string) {
        fetch(BACKEND_URL + "users/search?query=" + query, {
            headers: {
                Accepts: "application/json",
                Authorization: SessionHandler.getAuthToken()
            }
        }).then((response) => {
            if (response.ok) {
                return response.json().then((response) => {
                    let foundUsers: any = <NotificationBox
                        message={`No user with the name '${query}' was found!`}
                        type={"is-danger is-light mx-2"}
                        hasDelete={false}
                    />

                    if (response.userFound) {
                        foundUsers = JSON.parse(response.users);
                        for (let index in foundUsers) {
                            if (foundUsers.hasOwnProperty(index)) {
                                foundUsers[index] =
                                    <SearchResult username={foundUsers[index]} key={"result_" + foundUsers[index]}/>
                            }
                        }
                    }

                    this.setState({
                        displayLoading: false,
                        searchResults: foundUsers
                    });
                });
            } else {
                console.log(response);
            }
        });


    }

    render() {
        return (
            <div className={`dropdown ${this.state.searchQuery !== "" ? "is-active" : ""}`}>
                <div className="dropdown-trigger">
                    <div className="field" aria-haspopup={"true"} aria-controls={"searchResults"}>
                        <div className="control is-expanded has-icons-right">
                            <input
                                className="input is-primary"
                                type="search"
                                value={this.state.searchQuery}
                                placeholder="Search for other users"
                                maxLength={20}
                                onChange={this.updateSearch}/>
                            <span className="icon is-small is-right">
                                <FontAwesomeIcon icon={faSearch}/>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="dropdown-menu is-fullwidth" id={"searchResults"} role={"menu"}>
                    <div className="dropdown-content">
                        {
                            this.state.displayLoading ?
                                <div className="dropdown-item">
                                    <div className="field has-addons">
                                        <div className="control">
                                            <input className="input is-static"
                                                   type="text"
                                                   placeholder={`Searching...`}
                                                   readOnly={true}/>
                                        </div>
                                        <div className="control">
                                            <button className="button is-loading is-white" disabled={true} />
                                        </div>
                                    </div>
                                </div>
                                :
                                this.state.searchResults
                        }
                    </div>
                </div>
            </div>
        );
    }
}
