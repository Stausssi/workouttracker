import {BrowserRouter, Route} from "react-router-dom";
import Homepage from "./pages/Homepage";
import "./css/App.css";
import "bulma";
import "bulma-extensions/dist/css/bulma-extensions.min.css";
import {Component} from "react";

import SessionHandler from "./utilities/SessionHandler";
import LoginContainer from "./pages/LoginContainer";
import ProtectedRoute from "./utilities/Routing";
import Verify from "./components/login/Verify";
import SuccessfulSignup from "./components/login/SuccessfulSignUp";
import {OwnProfile, FollowingPage} from "./pages/ProfilePages";

interface Props {
}

interface State {
}

export default class App extends Component<Props, State> {
    render() {
        // Conditional Routing:
        // Route      LoggedIn       NotLoggedIn
        // _____________________________________
        // "/"        Homepage       Login
        // "login"    Homepage       Login
        // "sign-up"  Homepage       sign-up

        return (
            // This BrowserRouter handles the routing of the entire application
            // TODO: Fix router refresh problem, see: https://stackoverflow.com/questions/44943920/react-router-stay-at-the-same-page-after-refresh
            <BrowserRouter>
                <Route exact path="/" component={SessionHandler.isLoggedIn() ? Homepage : LoginContainer}/>
                <Route exact path="/dev" component={Homepage}/>
                <ProtectedRoute exact path="/login" component={LoginContainer}
                                AuthenticationFunction={SessionHandler.isNotLoggedIn} redirectPath={"/"}/>
                <ProtectedRoute exact path="/sign-up" component={LoginContainer}
                                AuthenticationFunction={SessionHandler.isNotLoggedIn} redirectPath={"/"}/>
                <ProtectedRoute exact path="/verify" component={Verify}
                                AuthenticationFunction={SessionHandler.isNotLoggedIn} redirectPath={"/"}/>
                <ProtectedRoute exact path="/successful-signup" component={SuccessfulSignup}
                                AuthenticationFunction={SessionHandler.isNotLoggedIn} redirectPath={"/"}/>
                <ProtectedRoute exact path="/profile" component={OwnProfile}
                                AuthenticationFunction={SessionHandler.isLoggedIn} redirectPath={"/"}/>
                <ProtectedRoute exact path="/users/:username" component={FollowingPage}
                                AuthenticationFunction={SessionHandler.isLoggedIn} redirectPath={"/"}/>
            </BrowserRouter>
        );
    }
}

export const BACKEND_URL = "http://localhost:9000/backend/";
export const FRONTEND_URL = "http://localhost:3000/";
