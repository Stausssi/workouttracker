import SearchBar from './components/search/SearchBar';
import Logo from './img/WorkoutLogo.png'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHome, faSignInAlt, faUser} from '@fortawesome/free-solid-svg-icons';
import Modal from './components/activity/Modal';
import { Link } from "react-router-dom";
import SessionHandler from "./utilities/SessionHandler";

export const Head = () =>
    <section className="hero is-dark is-small">
        <div className="hero-head">
            <nav className="navbar">
                <div className="navbar-brand">
                    <a className="navbar-item" href="/Second">
                        <img src={Logo} alt="Logo"/>
                    </a>
                </div>
                <div id="navbarMenuHeroA" className="navbar-menu">
                </div>
                <div className="navbar-end">
                    <div className="navbar-item">
                        <SearchBar/>
                    </div>
                    <a className="navbar-item" href="/">
                        <span className="icon">
                              <FontAwesomeIcon icon={faHome}/>
                        </span>
                        <div>Home</div>
                    </a>
                    <a className="navbar-item" href="/Profil">
                        <span className="icon">
                              <FontAwesomeIcon icon={faUser}/>
                        </span>
                        <div>Profil</div>
                    </a>
                    <div className="navbar-item">
                        <Modal> </Modal>
                    </div>
                    <span className="navbar-item">
                        <Link className="button is-primary is-inverted" to={'/login'} onClick={() => SessionHandler.logOut()}>
                            <span className="icon">
                              <FontAwesomeIcon icon={faSignInAlt}/>
                            </span>
                            <span>Logout</span>
                        </Link>
                    </span>
                </div>
            </nav>
        </div>
        <div className="hero-body">
            <div className="container has-text-centered">
                <p className="title">
                    Workout-Tracker
                </p>
                <p className="subtitle">
                    Time for Sport
                </p>
            </div>
        </div>
        <div className="hero-foot">
            <nav className="tabs">
                <ul>
                    <li className="is-active"><a href="/#">Overview</a></li>
                    <li><a href="/#">Modifiers</a></li>
                    <li><a href="/#">Grid</a></li>
                    <li><a href="/#">Elements</a></li>
                    <li><a href="/#">Components</a></li>
                    <li><a href="/#">Layout</a></li>
                </ul>
            </nav>
        </div>
    </section>

export default Head;

