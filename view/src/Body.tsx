import React from 'react';
import './css/App.css';
import ToggleButton from'./ToggleButton'
import 'bulma-extensions/bulma-switch/dist/css/bulma-switch.min.css'
import Calendar1 from './FullCalendar';
import Graphs from './Charts';

interface Props {
}
interface State {
  showPopup:boolean
  active:boolean
  apiResponse:string
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
		fetch("http://157.90.160.201:9000/backend/testConnection")
			.then(res => res.text())
			.then(res => this.setState({ apiResponse: res }));
	}

	componentDidMount() {
		this.callAPI();
	}


  render () {  
    return(
    <section id="body-content">
    <div id="col-1">
    <h1>This part is for the own and the user feed</h1>
    <ToggleButton />
    </div>
    <div id="col-2">
    <h1>This part is for calendar to view events and for charts to see analytics infomation</h1>
    <div id="testcal">
      <Calendar1/>
    </div>
    <div>
      <Graphs/>
    </div>
    </div>
  </section>
    )
  }
}
