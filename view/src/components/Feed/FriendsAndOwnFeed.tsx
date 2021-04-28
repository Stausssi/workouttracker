import React from "react";
import {BACKEND_URL} from "../../App";
import SessionHandler from "../../utilities/SessionHandler";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faAngleUp, faThumbsUp} from "@fortawesome/free-solid-svg-icons";
import InfiniteScroll from "react-infinite-scroll-component";

type postData = {
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
                                <div className="mb-5" key={index}><ActivityBox postData={activity}/></div>
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

// ------------------------------------------------------------------------------------------------------------------

//Component for an activity Box, to contain a like button, comment section and an activity table
class ActivityBox extends React.Component<{ postData: postData }, any> {
    // TODO: like button pressed
    render() {
        const props = this.props.postData;
        const image_path = props.sport + '.png';
        return (
            <div className="card">
                <div className="card-content">
                    <div className="media">
                        <figure className="image is-32x32">
                            <img src={image_path} alt="product"/>
                        </figure>
                        <div className="media-content has-text-left	pl-2">
                            <p className="title is-4">{props.sport}</p>
                            <p className="subtitle is-6">
                                <time
                                    dateTime="2016-1-1">{new Date(props.addedAt).toLocaleString().slice(0, 16)}</time>
                                - {props.username}
                            </p>
                        </div>
                        <div className="field has-addons">
                            <button className="button is-success is-rounded">
                                <span>
                                    {Number(props.likes)}
                                </span>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faThumbsUp}/>
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="content ">
                        <ActivityTable activityData={props.activityData}/>
                    </div>
                </div>
                <div className="card-footer">
                    <Comments activity_id={props.activity_id}/>
                </div>
            </div>
        );
    }
}

// ------------------------------------------------------------------------------------------------------------------

const activityInfo = {
    distance: { // db unit: Meters
        title: 'Distance',
        format: (DistanceInMeters: number) => {
            if (DistanceInMeters < 1000) {
                return (DistanceInMeters + " m");
            } else {
                return ((DistanceInMeters / 1000).toFixed(1) + " km");
            }
        }
    },
    duration: { //db unit: seconds
        title: 'Duration',
        format: (DurationInSeconds: number) => {
            const date = new Date(DurationInSeconds * 1000);

            if (DurationInSeconds > 3600) {
                return (date.toISOString().substr(11, 5) + ' h');
            } else {
                return (date.toISOString().substr(14, 5) + ' m');
            }
        }
    },
    pace: { // db unit: m/s * 3,6 = km/h
        title: 'Pace',
        format: (metersPerSecond: number) => {
            return ((metersPerSecond * 3.6).toFixed(1) + " km/s");
        }
    },
    averageHeartRate: {
        title: 'Average heartrate',
        format: (heartrate: number) => {
            return (heartrate + " bpm");
        }
    },
    altitudeDifference: {
        title: 'Altitude',
        format: (meters: number) => {
            return (meters + " m");
        }
    }
}

interface activityData {
    distance?: number,
    duration?: number,
    pace?: number,
    averageHeartRate?: number,
    altitudeDifference?: number
}

interface TableProps {
    activityData: activityData
}

// ------------------------------------------------------------------------------------------------------------------

//displays an activity table inside an activity feed box
class ActivityTable extends React.Component<TableProps, {}> {
    constructor(props: TableProps) {
        super(props);

        //get props keys
        const activityObject = this.props["activityData"];

        //iterate over props and check if value exists --> delete if not
        // @ts-ignore
        Object.keys(activityObject).forEach((k: any) => activityObject[k] == null && delete activityObject[k])
    }

    renderTableHeaders(activityData: activityData) {
        let keys = Object.keys(activityData) //get property keys
        // @ts-ignore
        return keys.map((key) => <th>{activityInfo[key].title}</th>)
    }

    renderTableContents(activityData: activityData) {
        let keys = Object.keys(activityData) //get property keys
        let values = Object.values(activityData) // get values
        // @ts-ignore
        return keys.map((key, index) => <th>{activityInfo[key].format(values[index])}</th>)
    }

    render() {
        return (
            <>
                <table className="table is-narrow">
                    <thead>
                    {this.renderTableHeaders(this.props.activityData)}
                    </thead>
                    <tbody>
                    <tr>
                        {this.renderTableContents(this.props.activityData)}
                    </tr>
                    </tbody>
                </table>
            </>
        );
    }
}

// ------------------------------------------------------------------------------------------------------------------

interface CommentState {
    showComments: boolean
}

interface CommentProps {
    activity_id: number
}

class Comments extends React.Component<CommentProps, CommentState> {
    constructor(props: CommentProps) {
        super(props);

        this.state = {
            showComments: false
        }
    }

    render() {
        // TODO: fill comments content
        // TODO: input textarea, etc.
        return (
            <div className="card is-flex-grow-1">
                <header className="card-header">
                    <p className="card-header-title">Comments</p>
                    <button
                        className="card-header-icon"
                        onClick={() => this.setState({showComments: !this.state.showComments})}
                        aria-label="more options"
                        style={{border: "none"}}>
                        <span className="icon">
                            <FontAwesomeIcon icon={this.state.showComments ? faAngleUp : faAngleDown}/>
                        </span>
                    </button>
                </header>
                {this.state.showComments ?
                    <>
                        <div className="card-content">
                            <p className="title">Comments go here</p>
                        </div>
                        <footer className="card-footer">
                            <div className="card-footer-item">
                        <span>
                            Text Input goes here
                        </span>
                            </div>
                            <div className="card-footer-item">
                        <span>
                            Submit Button goes here
                        </span>
                            </div>
                        </footer>
                    </>
                    :
                    <></>
                }
            </div>
        );
    }
}