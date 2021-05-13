import React from 'react';
import '../../style/App.scss';
import {Feed} from "./FeedContent";

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
        let feed = this.state.switch ? <Feed key={"Feed1"} ownFeed={false}/> : <Feed key={"Feed2"} ownFeed={true}/>;

        // The padding of the feed is calculated by the width of the scrollbar (1em) and bulma padding units
        // style switch as 2 columns
        return (
            <div className="pr-2 pl-5 pt-3 pb-1">
                <div className="columns is-centered mt-3">
                    <div className="column is-half has-text-right p-0 mr-2">
                        <label htmlFor="feedSwitch" className="is-size-5 is-unselectable">Own Feed </label>
                    </div>
                    <div className="column is-narrow has-text-centered p-0">
                        <div className="field">
                            <input
                                id="feedSwitch"
                                type="checkbox"
                                className="switch is-medium is-rounded is-success"
                                onChange={() => this.switchFeed()}/>
                            <label htmlFor="feedSwitch" className="is-unselectable has-text-centered feedSwitch" />
                        </div>
                    </div>
                    <div className="column is-half has-text-left p-0 ml-2">
                        <label htmlFor="feedSwitch" className="is-size-5 is-unselectable">Friends Feed</label>
                    </div>
                </div>

                {feed}
            </div>
        )
    }
}