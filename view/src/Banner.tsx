import React from "react";
import "bulma";

class Banner extends React.Component {
  render() {
    return (
      <section className="hero is-primary is-fullheight">
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title">Hello, Bulma!</h1>
            <h2 className="subtitle">This is react app feat. Bulma</h2>
          </div>
        </div>
      </section>
    );
  }
}

export default Banner;