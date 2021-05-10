import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown, faAngleUp, faThumbsUp} from "@fortawesome/free-solid-svg-icons";

import {postData} from "../Feed/FeedContent";
import CommentContainer from "../comments/CommentContainer";
import SessionHandler from "../../utilities/SessionHandler";
import {BACKEND_URL} from "../../App";
import {Formatter} from "../../utilities/Formatter";
import {Link} from "react-router-dom";

// Define title and formatting function for every data entry
export const activityInfo = {
    distance: { // db unit: Meters
        title: 'Distance',
        format: (distanceInMeters: number) => Formatter.format_MeterKilometer(distanceInMeters)
    },
    duration: { //db unit: seconds
        title: 'Duration',
        format: (durationInSeconds: number) => Formatter.format_ActivityDuration(durationInSeconds)
    },
    pace: {
        title: 'Speed',
        format: (kmPerHour: number) => Formatter.format_pace(kmPerHour)
    },
    averageHeartRate: {
        title: 'Average heart rate',
        format: (heartRate: number) => Formatter.format_heartRate(heartRate)
    },
    altitudeDifference: {
        title: 'Altitude',
        format: (meters: number) => Formatter.format_MeterKilometer(meters)
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
    postData: postData,
    ownFeed: boolean
}

export interface ActivityState {
    showThumbsUp: boolean,
    thumbsUpCounter: number
}

//Component for an activity Box, to contain a like button, comment section and an activity table
export class ActivityBox extends React.Component<ActivityProps, ActivityState> {
    private readonly thumbsRefreshInterval: any;
    private readonly abortController: AbortController;

    constructor(props: ActivityProps) {
        super(props);

        this.state = {
            showThumbsUp: this.props.postData.thumbUp,
            thumbsUpCounter: this.props.postData.likes
        }

        this.abortController = new AbortController();

        this.thumbIsPressed = this.thumbIsPressed.bind(this);
    }

    thumbIsPressed(event: any) {
        fetch(BACKEND_URL + 'interaction/thumbsUp', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: SessionHandler.getAuthToken()
            },
            body: JSON.stringify({
                activity: this.props.postData.activity_id,
            }),
            signal: this.abortController.signal
        }).then((response) => {
            if (response.ok) {
                let likedBefore = this.state.showThumbsUp;

                // In-/decrement local counter depending on whether the activity was liked before
                this.setState({
                    showThumbsUp: !likedBefore,
                    thumbsUpCounter: (likedBefore ? this.state.thumbsUpCounter - 1 : this.state.thumbsUpCounter + 1)
                });
            } else {
                // Log reponse otherwise
                response.text().then((response) => console.log(response));
            }
        }).catch((error: any) => {
            if (error.name !== "AbortError") {
                console.log("Fetch failed:", error);
            }
        });
    }

    componentWillUnmount() {
        // Dont refresh thumbs
        clearInterval(this.thumbsRefreshInterval);

        // Abort all running requests
        this.abortController.abort();
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
                                <time>{Formatter.formatDateTime(new Date(Date.parse(String(props.addedAt))))}</time>
                                {this.props.ownFeed ? "" : <> - <Link className="has-text-primary"
                                                                      to={`/users/${props.username}`}>@{props.username}</Link></>}
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
export class ActivityTable extends React.Component<TableProps, {}> {
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
        // Delete "null" keys from activityData
        // @ts-ignore
        Object.keys(this.props.activityData).forEach((k: any) => this.props.activityData[k] === null && delete this.props.activityData[k]);

        return (
            <>
                <table className="table is-narrow">
                    <thead>
                    <tr>{this.renderTableHeaders(this.props.activityData)}</tr>
                    </thead>
                    <tbody>
                    <tr>{this.renderTableContents(this.props.activityData)}</tr>
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
            // insert in backend
            fetch(BACKEND_URL + 'interaction/addComment', {
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

                    // Trigger refreshComment in CommentContainer
                    this.commentContainerChild.current?.refreshComments();
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
                            <CommentContainer activity_id={this.props.activity_id} ref={this.commentContainerChild}/>
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
                                        {
                                            this.state.commentText.length > 0 ?
                                                <p className={`help is-light ${
                                                    this.state.commentText.length === 500 ? "is-danger" :
                                                        this.state.commentText.length >= 450 ? "is-warning" : "is-success"}`}>
                                                    {500 - this.state.commentText.length} chars remaining!
                                                </p> :
                                                <></>
                                        }
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