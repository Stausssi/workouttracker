import React, {Component} from "react";
import {BACKEND_URL} from "../../App";
import Comment from './Comment'
import SessionHandler from "../../utilities/SessionHandler";

/*The component to add at a activity and has the hole comment stuff.
* Here you can insert new comments and see all comments to a specified activity.
* If you looking for a part of the comment component although look in the components folder of the comments*/

interface State {
    comments: any[],
    numComments: number
    activity: number
}

export default class CommentContainer extends Component<{ activity_id: number }, State> {
    private readonly commentRefreshInterval: any;
    private readonly abortController: AbortController;

    constructor(props: any) {
        super(props);

        this.state = {
            comments: [],
            numComments: 5,
            activity: props.activity_id
        };

        this.abortController = new AbortController();

        this.refreshComments();

        this.commentRefreshInterval = setInterval(() => {  //set interval
            this.refreshComments();
        }, 15000);

        this.handleChange = this.handleChange.bind(this);
        this.loadMoreComments = this.loadMoreComments.bind(this);
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        // makes all input attributes "controlled components"
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        } as unknown as Pick<State, keyof State>);
    }

    //refresh comments
    refreshComments() {
        fetch(BACKEND_URL + "interaction/commentIsNew?activity=" + this.state.activity, {//get as default
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: SessionHandler.getAuthToken()
            },
            signal: this.abortController.signal
        }).then((response) => {
            if (response.ok) {
                // Examine the text in the response
                response.json().then((data) => {
                    //console.log(data.Rowdata);
                    this.setState({comments: data.Rowdata});
                });
            } else {
                console.log('Looks like there was a problem. Status Code: ' + response.status);
            }

        }).catch((error: any) => {
            if (error.name !== "AbortError") {
                console.log("Fetch failed:", error);
            }
        });
    }

    loadMoreComments() {
        this.setState({numComments: this.state.numComments + 5})
    }

    renderComments() {
        let lengthAll = this.state.comments.length;
        if (lengthAll > 0) {
            let fieldsHTML: JSX.Element[] = []
            let lengthRendered = this.state.numComments;

            // Display a load more button if not every comment is visible
            if (lengthAll > lengthRendered) {
                fieldsHTML.push(
                    <button
                        className="button"
                        key={"loadMore_" + this.props.activity_id}
                        onClick={this.loadMoreComments}
                    >
                        Load older comments
                    </button>);
            }

            // Render the X most recent comments
            let numFirst = lengthAll - lengthRendered;
            for (let i = numFirst; i < lengthAll; i++) {
                let comment = this.state.comments[i];
                if (comment) {
                    // Also check whether the previous comment was made by the same user
                    let prevComment = this.state.comments[i - 1];
                    let prevName = prevComment && i !== numFirst ? prevComment.name : "";
                    fieldsHTML.push(<Comment key={comment.id} comment={comment} newUser={comment.name !== prevName}/>)
                }
            }

            return fieldsHTML;
        } else {
            return <p className="tag is-primary is-medium">No Comments here yet. Be the first!</p>
        }
    }

    componentWillUnmount() {
        // Clear interval and cancel ongoing fetch requests
        clearInterval(this.commentRefreshInterval);

        this.abortController.abort();
    }

    render() {
        return (
            <div className="container">
                {this.renderComments()}
            </div>
        );
    }
}