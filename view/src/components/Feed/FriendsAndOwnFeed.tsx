import React from "react";
import {BACKEND_URL} from "../../App";
import SessionHandler from "../../utilities/SessionHandler";

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
        return (
            <>
                <div className="card">
                    <div className="card-content">
                        <div className="media">
                            <figure className="image is-48x48">
                                <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image"/>
                            </figure>
                            <div className="media-content has-text-left	pl-2">
                                <p className="title is-4">{props.sport}</p>
                                <p className="subtitle is-6">
                                    <time dateTime="2016-1-1">{new Date(props.addedAt).toLocaleString().slice(0,16)}</time>
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
                            <button className="card-header-icon" aria-label="more options">
                                <span className="icon">
                                    <i className="fas fa-angle-down" aria-hidden="true"/>
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

//displays an activity table
class ActivityTable extends React.Component<props, {}> {
    constructor(props: props) {
        super(props);

        //get props keys
        const activityObject = this.props["activityData"];

        //iterate over props and check if value exists --> delete if not
        // @ts-ignore
        Object.keys(activityObject).forEach((k:any) => activityObject[k] == null && delete activityObject[k])
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