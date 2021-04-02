import React from 'react';
import './css/App.css';
import ToggleButton from './ToggleButton'
import 'bulma-extensions/bulma-switch/dist/css/bulma-switch.min.css'

interface Props {
}

interface State {
    showPopup: boolean
    active: boolean
    apiResponse: any
}

export default class Body extends React.Component<Props, State> {
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
            .then(res => this.setState({apiResponse: res}));
    }

    componentDidMount() {
        this.callAPI();
    }

    render() {
        return (
            <section id="body-content">
                <div id="col-1">
                    <h1>This is half of a page</h1>
                    <p>{this.state.apiResponse}</p>
                    <div>
                        <ToggleButton/>
                    </div>
                </div>
                <div id="col-2">
                    <h1>Hier kommen Statistiken, Analytik, Charts und Kalender</h1>
                </div>
            </section>
        )
    }
}
