import {Switch} from "react-router";
import Login from "./login.component";
import SignUp from "./signup.component";
import {Route, Link} from "react-router-dom";
import React from "react";

export default class LoginContainer extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="">
                <nav className="navbar" role="navigation">
                    <div className="navbar-brand">
                        <Link className="navbar-item" to={"/login"}>Workout-Tracker</Link>
                    </div>
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                <Link className="button is-primary" to={"/login"}>Sign in</Link>
                                <Link className="button is-light" to={"/sign-up"}>Sign up</Link>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="hero is-fullheight-with-navbar">
                            <Switch>
                                <Route exact path='/' component={Login}/>
                                <Route path="/login" component={Login}/>
                                <Route path="/sign-up" component={SignUp}/>
                            </Switch>
                </div>
            </div>
        );
    }
}