import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

//Search component

class Search extends React.Component {
  render() {
    return (
      <section>
 <div className="search"> 
                <input className="input is-primary" type="text" placeholder="Search"/>
                <button type="submit"><FontAwesomeIcon icon ={faSearch}/></button>
</div>
          </section>
    );
  }
}

export default Search;
