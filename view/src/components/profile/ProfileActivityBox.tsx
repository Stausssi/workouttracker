import React from "react";
import {postData} from "../Feed/FeedContent";
import {Formatter} from "../../utilities/Formatter";
import {ActivityTable} from "../activity/ActivityBox";
import {ActivityState} from "../activity/ActivityBox";

interface ProfileActivityProps {
    postData: postData
}

//Component for an activity Box on the profile page, to contain a like counter and an activity table
export class ProfileActivityBox extends React.Component<ProfileActivityProps, ActivityState> {
    private readonly thumbsRefreshInterval: any;
    private readonly abortController: AbortController;

    constructor(props: ProfileActivityProps) {
        super(props);

        this.state = {
            showThumbsUp: false,
            thumbsUpCounter: 0
        }

        this.abortController = new AbortController();
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
                            </p>
                        </div>
                    </div>

                    <div className="content ">
                        <ActivityTable activityData={props.activityData}/>
                    </div>
                </div>
            </div>
        );
    }
}