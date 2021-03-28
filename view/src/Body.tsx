import React, { Component } from 'react';
import './css/App.css';
import ToggleButton from'./ToggleButton'
import 'bulma-extensions/bulma-switch/dist/css/bulma-switch.min.css'
import Calendar1 from './FullCalendar';
import SmallCalendar from './SmallCalendar';

interface Props {
}
interface State {
  showPopup:boolean
  active:boolean
  apiResponse:any
}

export default class Body extends React.Component<Props,State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showPopup: false,
      active: false,
      apiResponse: ""
    };
  }
  callAPI() {
		fetch("http://157.90.160.201:9000/testAPI")
			.then(res => res.text())
			.then(res => this.setState({ apiResponse: res }));
	}

	componentWillMount() {
		this.callAPI();
	}

  render () {  
    const active = this.state.active ? "is-active" : "";
    const children =this.props.children
    return(
    <section id="body-content">
    <div id="col-1">
    <h1>This is half of a page</h1>
    <p>{this.state.apiResponse}</p>
    <div>
    <ToggleButton />
    </div>
    <div>
    <SmallCalendar />
    </div>
    </div>
    <div id="col-2">
    <h1>Hier kommen Statistiken, Analytik, Charts und Kalender</h1>
    <div id="testcal">
      <Calendar1/>
    </div>
    <div>Test</div>
    </div>
  </section>
    )
  }
}
