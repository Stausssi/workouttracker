import {BrowserRouter, Route} from 'react-router-dom'
import Homepage from './Homepage';
import './css/App.css';
import "bulma"
import 'bulma-extensions/dist/css/bulma-extensions.min.css'
import {Component} from "react";
import SessionHandler from "./SessionHandler";
import LoginContainer from "./components/LoginContainer";
import ProtectedRoute from "./utilities/Routing";
import Verify from "./components/verify.component";
import SuccessfulSignup from "./components/successfulSignup.component";


export default class App extends Component< { }, { } > {
    render() {

        // Conditional Routing:

        // Route      LoggedIn       NotLoggedIn
        // _____________________________________
        // "/"        Homepage       Login
        // "login"    Homepage       Login
        // "sign-up"  Homepage       sign-up

        return (
            // This BrowserRouter handles the routing of the entire application
            <BrowserRouter>
                <div className="App">
                    <div className="children">
                        <Route exact path="/">
                            {SessionHandler.isLoggedIn() ? <Homepage /> : <LoginContainer />}
                        </Route>

                        <ProtectedRoute exact path="/login" component={LoginContainer} AuthenticationFunction={SessionHandler.isNotLoggedIn} redirectPath={"/"}/>
                        <ProtectedRoute exact path="/sign-up" component={LoginContainer} AuthenticationFunction={SessionHandler.isNotLoggedIn} redirectPath={"/"}/>
                        <ProtectedRoute exact path="/verify" component={Verify} AuthenticationFunction={SessionHandler.isNotLoggedIn} redirectPath={"/"}/>
                        <ProtectedRoute exact path="/successful-signup" component={SuccessfulSignup} AuthenticationFunction={SessionHandler.isNotLoggedIn} redirectPath={"/"}/>

                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
