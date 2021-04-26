import React from "react";
import {BACKEND_URL} from "../../App";
import SessionHandler from "../../utilities/SessionHandler";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown} from "@fortawesome/free-solid-svg-icons";

type postData = {
    likes: number
    activityData: activityData
    username: string
    sport: string
    addedAt: Date
}

interface FeedState {
    postData: postData[] | [],
    //comments: string,
    loaded: boolean
    offset_page: number
}

interface EmptyProps {

}

export class OwnFeed extends React.Component<EmptyProps, FeedState> {
    constructor(props: EmptyProps) {
        super(props);
        this.state = {
            loaded: false,
            postData: [],
            offset_page: 0
        }
    }

    componentDidMount() {
        // fetch X activities from Backend
        this.getFeed()
        //set loaded to true
        this.setState({loaded: true});
    }

    getFeed() {
        fetch(BACKEND_URL + "feed/own?offset=" + this.state.offset_page, {
            method: "GET",
            headers: {
                Accepts: "application/json",
                Authorization: SessionHandler.getAuthToken()
            }
        }).then((response) => {
            if (response.ok) {
                return response.json().then(response => {
                    this.setState({postData: response["activities"]});
                });
            }
        });
    }

    renderFeed() {
        return this.state.postData.map((activity: postData) => <div><ActivityBox postData={activity}/><br/></div>);
    }

    render() {
        return (
            <>
                <div className="pr-4 pl-4 pt-1 pb-1">
                    <div>Hier kommt die eigene Aktivität hin</div>
                    <div>Weitere eigene Komponenten</div>

                    {this.state.loaded ? this.renderFeed() : <p>not Working</p>}
                </div>
            </>
        );
    }
}

export class FriendsFeed extends React.Component<{}, {}> {
    render() {
        return (
            <>
                <div>Hier kommt die Aktivitäten der Freunde hin</div>
                <div>Weitere andere Komponenten</div>
            </>
        );
    }
}

//Component for an activity Box, to contain a like button, comment section and an activity table
class ActivityBox extends React.Component<{ postData: postData }, any> {
    render() {
        const props = this.props.postData;
        const image_path = props.sport + '.png';
        return (
            <>
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
                            <div className="">
                                <button className="button is-success is-rounded">Like {props.likes}</button>
                            </div>
                        </div>

                        <div className="content ">
                            <ActivityTable
                                activityData={props.activityData}/>
                        </div>
                    </div>
                    <div className="card">
                        <header className="card-header">
                            <p className="card-header-title">
                                Comments
                            </p>
                            <button className="card-header-icon button is-white is-large" aria-label="more options">
                                <span className="icon">
                                    <FontAwesomeIcon icon={faAngleDown}/>
                                </span>
                            </button>
                        </header>
                    </div>
                </div>
            </>
        );
    }
}

interface activityData {
    distance?: number,
    duration?: number,
    pace?: number,
    averageHeartRate?: number,
    altitudeDifference?: number
}

interface props {
    activityData: activityData
}

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
        title: 'Average heart rate',
        format: (heartrate: number) => {
            return (heartrate + " bpm");
        }
    },
    altitudeDifference: {
        title: 'altitude',
        format: (meters:number) => {
            return(meters + " m");
        }
    }
}

//displays an activity table
class ActivityTable extends React.Component<props, {}> {
    constructor(props: props) {
        super(props);

        //get props keys
        const activityObject = this.props["activityData"];

        //iterate over props and check if value exists --> delete if not
        // @ts-ignore
        Object.keys(activityObject).forEach((k: any) => activityObject[k] == null && delete activityObject[k])
    }

    renderTableHeaders(activityData: activityData) {
        let keys = Object.keys(activityData) //get property keys
        return keys.map((key) => <th>{key}</th>)
    }

    renderTableContents(activityData: activityData) {
        let values = Object.values(activityData) //get property values
        return values.map((value) => <th>{value}</th>)
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