import React from 'react';
import '../../css/App.css';
import 'bulma-extensions'
import {FriendsFeed, OwnFeed} from "./FriendsAndOwnFeed";

/*
* Contains the Friends and Own Feed and has the ability to toggle between them.
* */

interface State {
    switch: boolean
}

interface Props {
}

export default class FeedContainer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            switch: false
        };
    }

    switchFeed() {
        this.setState((state) => ({switch: !state.switch}))
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


