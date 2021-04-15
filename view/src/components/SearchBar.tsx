import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import SearchResult from "./SearchResult";
import {BACKEND_URL} from "../App";

interface Props {
}

interface State {
    searchQuery: string
    searchResults: JSX.Element;
    displayLoading: boolean
}

export default class SearchBar extends React.Component<Props, State> {
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
        let value = event.target.value;

        this.setState({
            searchQuery: value,
            displayLoading: true
        }, () => this.searchFor(value));
    }

    searchFor(query: string) {
        console.log(`Searching for user ${query} in the database`);

        fetch(BACKEND_URL + "users/get", {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                //Authorization: SessionHandler.getAuthToken()
            }
        }).then((response) => {
            if (response.ok) {
                this.setState({displayLoading: false});

                return response.json().then((response) => {
                    console.log("users received:", response);
                })
            }
        });

        this.setState({
            searchResults: <>
                <SearchResult username="@username"/>
                <SearchResult username="@extremlangerusername"/>
                <SearchResult username="1"/>
                <SearchResult username="@12345678901234567890"/>
                <SearchResult username="@username"/>
            </>
        })
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
                                placeholder="Search for other users"
                                onChange={this.updateSearch}/>
                            <span className="icon is-small is-right">
                                <FontAwesomeIcon icon={faSearch}/>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="dropdown-menu">
                    <div className="dropdown-content">
                        {this.state.searchResults}
                        {this.state.displayLoading ?
                            <>
                                <hr className="dropdown-divider" />
                                <div className="dropdown-item">
                                    <div className="control is-loading">
                                        <input className="input is-static" type="text" placeholder="Searching..." readOnly={true}/>
                                    </div>
                                </div>
                            </>
                            :
                            <></>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
