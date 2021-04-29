import React from "react";
import {BACKEND_URL} from "../../App";
import SessionHandler from "../../utilities/SessionHandler";
import InfiniteScroll from "react-infinite-scroll-component";
import {ActivityBox, activityData} from "../activity/ActivityBox";

export type postData = {
    activity_id: number,
    likes: number
    activityData: activityData
    username: string
    sport: string
    addedAt: Date
}

interface FeedState {
    postData: postData[] | [],
    loaded: boolean,
    hasMore: boolean
}

interface EmptyProps {

}

// ------------------------------------------------------------------------------------------------------------------

export class OwnFeed extends React.Component<EmptyProps, FeedState> {
    constructor(props: EmptyProps) {
        super(props);
        this.state = {
            postData: Array.from({length: 0}),
            loaded: false,
            hasMore: true
        }

        // bind function scopes
        this.getFeed = this.getFeed.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
        this.getFeed()
        this.setState({loaded: true})
    }

    getFeed() {
        fetch(BACKEND_URL + "feed/own?offset=" + this.state.postData.length, {
            method: "GET",
            headers: {
                Accepts: "application/json",
                Authorization: SessionHandler.getAuthToken()
            }
        }).then((response) => {
            if (response.ok) {

                //increment elements counter !!!!!!

                return response.json().then(response => {
                    const activities = response["activities"];
                    this.setState({
                        postData: this.state.postData.concat(activities),
                        hasMore: activities.length > 0
                    });
                });
            }
        });
    }

    refresh() {
        //reset postData and
        this.setState({postData: Array.from({length: 0})});
        // load new activities
        this.getFeed()
    }

    render() {
        return (
            <div className="pr-4 pl-4 pt-1 pb-1">
                {this.state.loaded ?
                    <InfiniteScroll
                        dataLength={this.state.postData.length}
                        next={this.getFeed}
                        hasMore={this.state.hasMore}
                        loader={<p className="tag ">Loading...</p>}
                        endMessage={<p className="tag is-info is-light is-inverted mb-5">No new activities found</p>}
                        scrollThreshold={0.9}
                        scrollableTarget="col-1"
                    >
                        {
                            this.state.postData.map((activity: postData, index: number) => (
                                <div className="mb-5" key={index}>
                                    <ActivityBox postData={activity}/>
                                </div>
                            ))
                        }
                    </InfiniteScroll> :
                    <h1>Not loaded</h1>
                }
            </div>
        );
    }
}

// ------------------------------------------------------------------------------------------------------------------

export class FriendsFeed extends React.Component<{}, {}> {
    render() {
        return (
            <>
            </>
        );
    }
}
