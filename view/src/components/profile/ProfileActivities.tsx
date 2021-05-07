import React from "react";
import {postData} from "../Feed/FeedContent";
import {BACKEND_URL} from "../../App";
import SessionHandler from "../../utilities/SessionHandler";
import {ProfileActivityBox} from "./ProfileActivityBox"

interface profileActivitiesProps {
    username: string
}

interface profileActivitiesState {
    postData: postData[] | [],
}

export class ProfileActivityContainer extends React.Component<profileActivitiesProps, profileActivitiesState> {
    private readonly abortController: AbortController;

    constructor(props: profileActivitiesProps) {
        super(props);

        this.state = {
            postData: []
        }

        this.abortController = new AbortController();
        this.getLastActivities = this.getLastActivities.bind(this);
    }

    componentDidMount() {
        //get most recent activities (2)
        this.getLastActivities(2)
    }

    componentDidUpdate(prevProps: Readonly<profileActivitiesProps>, prevState: Readonly<profileActivitiesState>, snapshot?: any) {
        if (prevProps.username !== this.props.username) {
            this.getLastActivities(2);
        }
    }

    // get the X most recent activities for a given user
    getLastActivities(numberOfActivities: number) {
        const get_url = BACKEND_URL + "feed/own?offset=0&user=" + this.props.username;
        fetch(get_url, {
            method: "GET",
            headers: {
                Accepts: "application/json",
                Authorization: SessionHandler.getAuthToken()
            },
            signal: this.abortController.signal
        }).then((response) => {
            if (response.ok) {
                return response.json().then(response => {
                    const activities = response["activities"];
                    this.setState({
                        postData: activities.slice(0, numberOfActivities)
                    });
                });
            }
        }).catch((error: any) => {
            if (error.name !== "AbortError") {
                console.log("Fetch failed:", error);
            }
        });
    }

    componentWillUnmount() {
        this.abortController.abort()
    }

    render() {
        const postData = this.state.postData;
        return (
            <>
                {
                    postData.length > 0 ?
                        postData.map((activity: postData, index: number) => (
                                <div className="mb-5" key={"user_feed_" + this.props.username + index}>
                                    <ProfileActivityBox postData={activity}/>
                                </div>
                            )
                        )
                        :
                        <p className="tag is-primary is-medium">{this.props.username} has no activities!</p>
                }
            </>
        );
    }
}