import React from 'react';
import './css/App.css';
import FeedContainer from './components/Feed/FeedContainer'
import 'bulma-extensions/bulma-switch/dist/css/bulma-switch.min.css'

interface Props {
}

interface State {
    showPopup: boolean
    active: boolean
}

export default class Body extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showPopup: false,
            active: false
        };
    }

    render() {
        return (
            <section id="body-content">
                <div id="col-1">
                    <FeedContainer/>
                </div>
                <div id="col-2">
                    <h1>Hier kommen Statistiken, Analytik, Charts und Kalender</h1>
                </div>
            </section>
        )
    }
}
