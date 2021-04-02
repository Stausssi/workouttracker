import Search from './Search';
import Logo from './img/WorkoutLogo.png'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHome, faSignInAlt, faUser} from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';

//Head of React app. Used on every page. Integration of Modal to create Activity and Search 

export const Head = () =>
<div id="head">
<section className="hero is-dark ">
  <div className="hero-head">
    <nav className="navbar">
        <div className="navbar-brand">
          <a className="navbar-item" href="/Second">
            <img src={Logo}alt="Logo" width={150}/>
          </a>
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
              <a className="button is-primary is-inverted" href='/Login'>
                <span className="icon">
                  <FontAwesomeIcon icon={faSignInAlt}/>
                </span>
                <span>Login</span>
              </a>
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
</section>
</div>
export default Head;

