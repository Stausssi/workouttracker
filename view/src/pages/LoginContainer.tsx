import {Switch} from "react-router";
import Login from "../components/login/Login";
import SignUp from "../components/login/SignUp";
import {Route} from "react-router-dom";
import React from "react";
import Head from "../components/Head";

export default class LoginContainer extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <>
                <Head/>
                <div className="hero is-fullheight-with-navbar has-background-grey-dark">
                    <Switch>
                        <Route exact path='/' component={Login}/>
                        <Route path="/login" component={Login}/>
                        <Route path="/sign-up" component={SignUp}/>
                    </Switch>
                </div>
            </>
        );
    }
}