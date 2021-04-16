import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import SearchResult from "./SearchResult";
import {BACKEND_URL} from "../../App";

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
        console.log(`Searching for user ${query} in the database`);

        this.setState({
            displayLoading: false,
            searchResults: <>
                <SearchResult username="@username"/>
                <SearchResult username="@extremlangerusername"/>
                <SearchResult username="1"/>
                <SearchResult username="@12345678901234567890"/>
            </>
        });

        // TODO: auth
        fetch(BACKEND_URL + "users/search?query=" + query).then((response) => {
            if (response.ok) {
                return response.json().then((response) => {
                    console.log("users received:", response);
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
                    <div className="field">
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
                <div className="dropdown-menu">
                    <div className="dropdown-content">
                        {this.state.searchResults}
                        {this.state.displayLoading ?
                            <>
                                <div className="dropdown-item">
                                    <div className="field">
                                        <div className="control is-loading">
                                            <input className="input is-static" type="text" placeholder="Searching..."
                                                   readOnly={true}/>
                                        </div>
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
