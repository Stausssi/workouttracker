import React from 'react';
import '../css/App.css';
import 'bulma-extensions'

interface Props {
}

interface State {
    switch: boolean
}

class OwnFeed extends React.Component<Props> {
    render() {
        return (
            <>
                <div>Hier kommt die eigene Aktivität hin</div>
                <div>Weitere eigene Komponenten</div>
            </>
        );
    }
}

class FriendsFeed extends React.Component<Props> {
    render() {
        return (
            <>
                <div>Hier kommt die Aktivitäten der Freunde hin</div>
                <div>Weitere andere Komponenten</div>
            </>
        );
    }
}

export default class ToggleButton extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            switch: false
        };
    }

    switchFeed() {
        console.log("test")
        this.setState((state) => ({switch: !state.switch}))
        console.log(this.state.switch)
    }

    render() {
        return (
            <section>
                <div className="field">
                    <input id="switchRoundedSuccess" type="checkbox" className="switch is-rounded is-success"
                           onChange={() => this.switchFeed()}/>
                    <label htmlFor="switchRoundedSuccess">Switch rounded success</label>
                </div>
                <div>{this.state.switch ? <FriendsFeed/> : <OwnFeed/>}</div>
            </section>
        )
    }
}


