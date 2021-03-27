import Search from './Search';
import Logo from './img/WorkoutLogo.png'

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
        <Search></Search>
        </div>
            <a className="navbar-item is-active" href="/#">
              Home
            </a>
            <a className="navbar-item" href="/Profil">
              Profil
            </a>
            <a className="navbar-item" href="https://bulma.io/documentation/">
              Documentation
            </a>
            <span className="navbar-item">
              <a className="button is-primary is-inverted" href='/Login' >
                <span className="icon">
                  <i className="fa fa-sign-in" aria-hidden="true"></i>
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
        Title
      </p>
      <p className="subtitle">
        Subtitle
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

