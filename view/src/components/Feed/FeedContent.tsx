import React from "react";
import {BACKEND_URL} from "../../App";
import SessionHandler from "../../utilities/SessionHandler";
import InfiniteScroll from "react-infinite-scroll-component";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSync} from "@fortawesome/free-solid-svg-icons";

import {ActivityBox, activityData} from "../activity/ActivityBox";


export interface postData {
    activity_id: number,
    likes: number,
    activityData: activityData,
    username: string,
    sport: string,
    addedAt: Date
}

interface FeedState {
    postData: postData[] | [],
    loaded: boolean,
    hasMore: boolean
}

interface FeedProps {
    ownFeed: boolean // true: Ownfeed, false: Friendsfeed
}

// ------------------------------------------------------------------------------------------------------------------

export class Feed extends React.Component<FeedProps, FeedState> {
    private readonly refreshInterval;

    constructor(props: FeedProps) {
        super(props);
        this.state = {
            postData: [],
            loaded: false,
            hasMore: true
        }

        this.refreshInterval = setInterval(() => {
            if(SessionHandler.getRefreshFeed(props.ownFeed)){
                SessionHandler.setRefreshFeed(false, props.ownFeed);
                this.refresh();
            }
        }, 1000);

        // bind function scopes
        this.getFeed = this.getFeed.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
        this.getFeed();
        this.setState({loaded: true});
    }

    componentWillUnmount() {
        clearInterval(this.refreshInterval);
    }

    getFeed() {
        const mode = this.props.ownFeed ? 'own' : 'following'; // determines the feed mode based on the bool prop ownFeed
        const get_url = BACKEND_URL + "feed/" + mode + "?offset=" + this.state.postData.length;
        fetch(get_url, {
            method: "GET",
            headers: {
                Accepts: "application/json",
                Authorization: SessionHandler.getAuthToken()
            }
        }).then((response) => {
            if (response.ok) {
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
        this.setState({postData: []}, () => {
            // load new activities
            this.getFeed()
        });
    }

    render() {
        return (
            <>
                <div className="pr-4 pl-4 pt-1 pb-1">
                    {this.state.loaded ?
                        <div>
                            {!this.props.ownFeed ?
                                <button className="button mb-3 mr-5 is-success" onClick={this.refresh}>
                                    <FontAwesomeIcon icon={faSync}/>
                                </button> : ""
                            }
                            <InfiniteScroll
                                dataLength={this.state.postData.length}
                                next={this.getFeed}
                                hasMore={this.state.hasMore}
                                loader={
                                    <div className="box">
                                        <div className="control is-loading">
                                            <input className="input is-static" type="text" readOnly={true}
                                                   placeholder="Loading ... "/>
                                        </div>
                                    </div>
                                }
                                endMessage={
                                    <p className="tag is-info is-light is-inverted mb-5">No new activities found</p>
                                }
                                scrollThreshold={0.9}
                                scrollableTarget="col-1"
                            >

                                {this.state.postData.map((activity: postData, index: number) => (
                                    <div className="mb-5" key={index}><ActivityBox ownFeed={this.props.ownFeed} postData={activity}/></div>))
                                }

                            </InfiniteScroll>
                        </div>
                        : <h1>Not loaded</h1>
                    }
                </div>
            </>
        );
    }
}
