import React from 'react';
import './css/App.css';
import FeedContainer from './components/Feed/FeedContainer'
import 'bulma-extensions/bulma-switch/dist/css/bulma-switch.min.css'
import Calendar from "./components/FullCalendar";
import Graphs from "./components/Charts";

interface Props {
}

interface State {
    showPopup: boolean;
    active: boolean;
}

export default class Body extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showPopup: false,
            active: false,
        };
    }

    render() {
        return (
            <section id="body-content">
                <div id="col-1">
                    <FeedContainer/>
                </div>
                <div id="col-2">
                    <div id="calendarcontainer">
                        <Calendar/>
                    </div>
                    <div id="chartscontainer">
                        <Graphs/>
                    </div>
                </div>
            </section>
        );
    }
}
