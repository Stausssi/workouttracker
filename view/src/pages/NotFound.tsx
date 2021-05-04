import React from "react";
import Head from "../components/Head";
import Foot from "../components/Foot";

export const NotFound = (props: any) => {
    let username = ""
    let state = props.location.state;
    if (state && state.username) {
        username = state.username
    }

    let type = username.length === 0 ? "page" : "user";
    let spanText = username.length === 0 ? props.location.pathname.substr(1) : username;

    return (
        <>
            <Head/>
            <div id="body-content" className="has-background-grey-dark hasScrollbar">
                <div className="container">
                    <div className="box m-6">
                        <h1 className="title is-1 has-text-danger">404 - Not Found</h1>
                        <p className="subtitle is-3">
                            {
                                props.location.pathname !== "/NotFound" || username.length > 0 ?
                                    <>
                                        The {type}
                                        <span
                                            className="subtitle is-4 is-family-code mx-2">
                                            '{spanText}'
                                        </span>
                                    </> :
                                    <>
                                        <span>This page </span>
                                    </>
                            }
                            doesn't exist!
                        </p>
                    </div>
                </div>
            </div>
            <Foot/>
        </>
    );
}

export default NotFound;