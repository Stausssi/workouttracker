import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import onClickOutside from "react-onclickoutside";
import FadeIn from 'react-fade-in';

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

class SearchBar extends React.Component<Props, State> {
    private readonly abortController: AbortController;
    private searchDelay: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            searchQuery: "",
            searchResults: <></>,
            displayLoading: false
        }

        this.abortController = new AbortController();

        this.updateSearch = this.updateSearch.bind(this);
    }

    updateSearch(event: any) {
        let value: string = String(event.target.value).replaceAll(" ", "");

        this.setState({
                searchQuery: value,
                searchResults: <></>,
                displayLoading: true
            }, () => {
                // Only start searching for the term if it hasn't changed for a second and is not empty
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
            method: "GET",
            headers: {
                Accepts: "application/json",
                Authorization: SessionHandler.getAuthToken()
            },
            signal: this.abortController.signal
        }).then((response) => {
            if (response.ok) {
                response.json().then((response) => {
                    // Display a NotificationBox if no users where found
                    let foundUsers: any = <NotificationBox
                        message={`User '${query}' could not be found!`}
                        type={"is-danger is-light mx-2"}
                        hasDelete={false}
                    />

                    if (response.userFound) {
                        foundUsers = JSON.parse(response.users);

                        // Create a SearchResult for every found user
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
                // Log response
                response.text().then((response) => console.log(response));
            }
        }).catch((error: any) => {
            if (error.name !== "AbortError") {
                console.log("Fetch failed:", error);
            }
        });
    }

    componentWillUnmount() {
        // Remove running timeout and abort running requests to prevent a memory leak
        clearTimeout(this.searchDelay);

        this.abortController.abort();
    }

    render() {
        return (
            <div className={`dropdown ${this.state.searchQuery !== "" ? "is-active" : ""}`}>
                <div className="dropdown-trigger">
                    <div className="field">
                        <div className="control is-expanded has-icons-right">
                            <input
                                className="input is-primary"
                                type="search"
                                value={this.state.searchQuery}
                                placeholder="Search for other users"
                                maxLength={30}
                                onChange={this.updateSearch}/>
                            <span className="icon is-small is-right">
                                <FontAwesomeIcon icon={faSearch}/>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="dropdown-menu">
                    <div className="dropdown-content">
                        {this.state.displayLoading ?
                            <div className="dropdown-item">
                                <div className="field has-addons">
                                    <div className="control">
                                        <input className="input is-static"
                                               type="text"
                                               placeholder={"Searching..."}
                                               readOnly={true}/>
                                    </div>
                                    <div className="control">
                                        <button className="button is-loading is-white" disabled={true}/>
                                    </div>
                                </div>
                            </div>
                            :
                            <FadeIn transitionDuration={300}>
                                {this.state.searchResults}
                            </FadeIn>
                        }
                    </div>
                </div>
            </div>
        );
    }

    handleClickOutside() {
        // Reset searchQuery on click outside component
        if (this.state.searchQuery !== "") {
            this.setState({
                searchQuery: "",
                searchResults: <></>,
                displayLoading: false
            });
        }
    }
}

export default onClickOutside(SearchBar);