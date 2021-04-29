import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faAngleUp, faThumbsUp} from "@fortawesome/free-solid-svg-icons";

import {postData} from "../Feed/FriendsAndOwnFeed";
import CommentContainer from "../comments/CommentContainer";
import SessionHandler from "../../utilities/SessionHandler";
import {BACKEND_URL} from "../../App";

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

export interface activityData {
    distance?: number,
    duration?: number,
    pace?: number,
    averageHeartRate?: number,
    altitudeDifference?: number
}

interface ActivityProps {
    postData: postData
}

interface ActivityState {
    showThumbsUp: boolean,
    thumbsUpCounter: number
}

//Component for an activity Box, to contain a like button, comment section and an activity table
export class ActivityBox extends React.Component<ActivityProps, ActivityState> {
    private readonly thumbInterval: any;

    constructor(props: ActivityProps) {
        super(props);

        this.state = {
            showThumbsUp: false,
            thumbsUpCounter: 0
        }

        // Check whether the user has liked the activity
        fetch(BACKEND_URL + 'isThumbsUpSet/' + this.props.postData.activity_id, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: SessionHandler.getAuthToken()
            },
        }).then((response) => {
            if (response.ok) {
                // Examine the text in the response
                response.json().then((data) => {
                    this.setState({showThumbsUp: data});
                });
            } else {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
            }

        });
        this.countThumbs();

        this.thumbInterval = setInterval(() => {
            this.countThumbs();
        }, 30000);

        this.countThumbs = this.countThumbs.bind(this);
        this.thumbIsPressed = this.thumbIsPressed.bind(this);
    }

    //Count Thumbs
    countThumbs() {
        fetch(BACKEND_URL + "countThumbs/" + this.props.postData.activity_id, {//get as default
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: SessionHandler.getAuthToken()
            },
        }).then((response) => {
            if (response.ok) {
                // Examine the text in the response
                response.json().then((data) => {
                    this.setState({thumbsUpCounter: data[0].counter});
                });
            } else {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
            }
        });
    }

    thumbIsPressed(event: any) {
        // TODO: As put
        console.log("thumb pressed");

        fetch(BACKEND_URL + 'thumbsUp', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: SessionHandler.getAuthToken()
            },
            body: JSON.stringify({
                activity: this.props.postData.activity_id,
            }),
        }).then((response) => {
            console.log(response);

            if (response.ok) {
                let likedBefore = this.state.showThumbsUp;

                this.setState({
                    showThumbsUp: !likedBefore,
                    thumbsUpCounter: (likedBefore ? this.state.thumbsUpCounter - 1 : this.state.thumbsUpCounter + 1)
                });
            } else {
                console.log(response);
            }
        });
        console.log("after fetch");
    }

    componentWillUnmount() {
        clearTimeout(this.thumbInterval);
    }

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
                            <button
                                className={`button is-rounded ${this.state.showThumbsUp ? "is-success" : ""}`}
                                onClick={this.thumbIsPressed}>
                                <span>
                                    {Number(this.state.thumbsUpCounter)}
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
                    <ActivityComments activity_id={props.activity_id}/>
                </div>
            </div>
        );
    }
}

// ------------------------------------------------------------------------------------------------------------------

interface TableProps {
    activityData: activityData
}

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
        return keys.map((key) => <th key={key}>{activityInfo[key].title}</th>)
    }

    renderTableContents(activityData: activityData) {
        let keys = Object.keys(activityData) //get property keys
        let values = Object.values(activityData) // get values

        // @ts-ignore
        return keys.map((key, index) => <th key={key}>{activityInfo[key].format(values[index])}</th>)
    }

    render() {
        return (
            <>
                <table className="table is-narrow">
                    <thead>
                    <tr>
                        {this.renderTableHeaders(this.props.activityData)}</tr>
                    </thead>
                    <tbody>
                    <tr>
                        {this.renderTableContents(this.props.activityData)}</tr>
                    </tbody>
                </table>
            </>
        );
    }
}

// ------------------------------------------------------------------------------------------------------------------

interface CommentState {
    showComments: boolean,
    commentText: string
}

interface CommentProps {
    activity_id: number
}

class ActivityComments extends React.Component<CommentProps, CommentState> {
    private readonly commentContainerChild: React.RefObject<CommentContainer>;

    constructor(props: CommentProps) {
        super(props);

        this.state = {
            showComments: false,
            commentText: ""
        }

        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);

        this.commentContainerChild = React.createRef();
    }

    handleCommentSubmit(event: any) {
        let commentText = this.state.commentText;
        if (commentText.length > 0) {
            // Add comment to comment container to display it instantly
            this.commentContainerChild.current?.addComment({
                text: commentText,
                name: SessionHandler.getUsername(),
                timestamp: new Date().toISOString().slice(0, 19).replace("T", " ")
            });

            // insert in backend
            fetch(BACKEND_URL + 'comment', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: SessionHandler.getAuthToken()
                },
                body: JSON.stringify({
                    text: commentText,
                    activity: this.props.activity_id,
                })
            }).then((response) => {
                if (response.ok) {
                    this.setState({
                        commentText: ""
                    })
                }
            });
        }
    }

    render() {
        return (
            <div className="card is-flex-grow-1">
                <header className="card-header">
                    <p className="card-header-title">Comments</p>
                    <button
                        className="card-header-icon"
                        onClick={() => this.setState({showComments: !this.state.showComments})}
                        aria-label="more options"
                        style={{
                            border: "none",
                            backgroundColor: "inherit"
                        }}>
                        <span className="icon">
                            <FontAwesomeIcon icon={this.state.showComments ? faAngleUp : faAngleDown}/>
                        </span>
                    </button>
                </header>
                {this.state.showComments ?
                    <>
                        <div className="card-content">
                            <CommentContainer activityNr={this.props.activity_id} ref={this.commentContainerChild} />
                        </div>
                        <footer className="card-footer">
                            <div className="card-footer-item">
                                <div className="field has-addons is-flex-grow-1">
                                    <div className="control is-expanded">
                                        <input
                                            className="input"
                                            type='text'
                                            value={this.state.commentText}
                                            maxLength={500}
                                            placeholder='Add your comment'
                                            onChange={(event: any) => this.setState({commentText: event.target.value})}
                                            onKeyUp={(event: any) => {
                                                // 13 is enter
                                                if (event.keyCode === 13) this.handleCommentSubmit(event);
                                            }}
                                        />
                                    </div>
                                    <div className="control">
                                        <button
                                            className="button is-primary"
                                            disabled={this.state.commentText.length === 0}
                                            onClick={this.handleCommentSubmit}>
                                            Send
                                        </button>
                                    </div>
                                </div>
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