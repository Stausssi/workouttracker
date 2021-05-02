import SearchBar from "./search/SearchBar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome, faSignInAlt, faUser} from "@fortawesome/free-solid-svg-icons";
import ActivityModal from "./activity/ActivityModal";
import {Link} from "react-router-dom";
import SessionHandler from "../utilities/SessionHandler";
import NewLogo from "../img/Logo.png";

//Head of React app. Used on every page. Integration of Modal to create Activity and Search

export const Head = () => (
    <div id="head">
        <section className="hero is-dark is-small">
            <div className="hero-head">
                <nav className="navbar">
                    <img src={NewLogo} alt="Logo" width={250}/>
                    <div
                        className="container has-text-centered is-justify-content-center is-align-items-center is-flex-grow-1">
                        <p className="title">Workout-Tracker</p>
                    </div>
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <SearchBar/>
                        </div>
                        <Link className="navbar-item" to="/">
                            <span className="icon">
                              <FontAwesomeIcon icon={faHome}/>
                            </span>
                            <div>Home</div>
                        </Link>
                        <Link className="navbar-item" to="/profile">
                            <span className="icon">
                                <FontAwesomeIcon icon={faUser}/>
                            </span>
                            <div>Profile</div>
                        </Link>
                        <div className="navbar-item">
                            <ActivityModal/>
                        </div>
                        <span className="navbar-item">
                          <Link
                              className="button is-primary is-inverted"
                              to={"/login"}
                              onClick={() => SessionHandler.logOut()}
                          >
                              <span className="icon">
                                  <FontAwesomeIcon icon={faSignInAlt}/>
                              </span>
                              <span>Logout</span>
                          </Link>
                        </span>
                    </div>
                </nav>
            </div>
            <div className="hero-body"/>
        </section>
    </div>
);
export default Head;
