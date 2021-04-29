import React, {Component} from "react";
import {BACKEND_URL} from "../../App";
import Comment from './Comment'
import SessionHandler from "../../utilities/SessionHandler";

/*The component to add at a activity and has the hole comment stuff.
* Here you can insert new comments and see all comments to a specified activity.
* If you looking for a part of the comment component although look in the components folder of the comments*/

interface State {
    comments: any[],
    activity: number
}

export default class CommentContainer extends Component<{ activityNr: number }, State> {
    private readonly commentInterval: any;
    constructor(props: any) {
        super(props);

        this.state = {
            comments: [],
            activity: props.activityNr
        };

        this.refreshComment();

        this.commentInterval = setInterval(() => {  //set interval
            this.refreshComment();
        }, 15000);

        this.handleChange = this.handleChange.bind(this);
        this.addComment = this.addComment.bind(this);
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

    //Add comment
    addComment(comment: any) {
        const id = Math.floor(Math.random() * 10000) + 1;
        const newComment = {id, ...comment};
        // console.log(newComment);
        const comments = this.state.comments;
        this.setState({comments: [...comments, newComment]});
    }

    //refresh comment
    refreshComment() {
        fetch(BACKEND_URL + "commentIsNew/" + this.state.activity, {//get as default
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: SessionHandler.getAuthToken()
            },
        }).then((response) => {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }
            // Examine the text in the response
            response.json().then((data) => {
                //console.log(data.Rowdata);
                this.setState({comments: data.Rowdata});
            });
        });
    }

    renderComments() {
        if (this.state.comments.length > 0) {
            let comments: JSX.Element[] = [];
            for (let key in this.state.comments) {
                let comment = this.state.comments[key];
                comments.push(<Comment key={comment.id} comment={comment} />)
            }
            return comments;
        } else {
            return <p className="tag is-info">No Comments here yet. Be the first!</p>
        }
    }

    componentWillUnmount() {
        clearTimeout(this.commentInterval);
    }

    render() {
        return (
            <div className="container">
                {this.renderComments()}
            </div>
        );
    }
}