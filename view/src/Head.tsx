import SearchBar from "./components/search/SearchBar";
import Logo from "./img/WorkoutLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faSignInAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import Modal from "./components/activity/Modal";
import { Link } from "react-router-dom";

//Head of React app. Used on every page. Integration of Modal to create Activity and Search

export const Head = () => (
  <div id="head">
    <section className="hero is-dark">
      <div className="hero-head">
        <nav className="navbar">
          <div className="navbar-brand">
            <a className="navbar-item" href="/Second">
              <img src={Logo} alt="Logo" width={150} />
            </a>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <SearchBar />
            </div>
            <Link className="navbar-item" to="/">
              <span className="icon">
                <FontAwesomeIcon icon={faHome} />
              </span>
              <div>Home</div>
            </Link>
            <Link className="navbar-item" to="/Profil">
              <span className="icon">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <div>Profil</div>
            </Link>
            <div className="navbar-item">
              <Modal />
            </div>
            <span className="navbar-item">
              <Link className="button is-primary is-inverted" to={"/login"}>
                <span className="icon">
                  <FontAwesomeIcon icon={faSignInAlt} />
                </span>
                <span>Login</span>
              </Link>
            </span>
          </div>
        </nav>
      </div>
      <div className="hero-body">
        <div className="container has-text-centered">
          <p className="title">Workout-Tracker</p>
          <p className="subtitle">Time for Sport</p>
        </div>
      </div>
    </section>
  </div>
);
export default Head;
