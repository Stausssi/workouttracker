import React from "react";

class Search extends React.Component {
  render() {
    return (
      <section>
 <div className="search"> 
                <input className="input is-primary" type="text" placeholder="Search"/>
                <button type="submit"><i className="fa fa-search"></i></button>
</div>
          </section>
    );
  }
}

export default Search;