import {Route, BrowserRouter} from 'react-router-dom'
import Homepage from './Homepage';
import Second from './Second';
import Profil from './Profil'
import './css/App.css';
import "bulma"
import 'bulma-extensions/dist/css/bulma-extensions.min.css'
import {Component} from "react";
import SessionHandler from "./SessionHandler";
import LoginContainer from "./components/LoginContainer";

interface Props {

}

interface State {
}

export default class App extends Component<Props, State> {
    mainPage: any;

    render() {
        if (SessionHandler.isLoggedIn()) {
            this.mainPage = Homepage;
        } else {
            this.mainPage = LoginContainer;
        }

        return (
            <BrowserRouter>
                <div className="App">
                    <div className="children">
                        <Route exact path="/" component={this.mainPage}/>
                        <Route exact path="/dev" component={Homepage}/>
                        <Route exact path="/Second" component={Second}/>
                        <Route exact path="/login" component={LoginContainer}/>
                        <Route exact path="/sign-up" component={LoginContainer}/>
                        <Route exact path="/Profil" component={Profil}/>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
