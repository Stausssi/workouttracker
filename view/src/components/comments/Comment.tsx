import {Formatter} from "../../utilities/Formatter";

interface Props {
    comment: any,
    newUser: boolean
}

//comment component format timestamp and comment and style with bulma comment component
const Comment = (props: Props) => {
    return (
        <article className="media">
            <div className="media-content">
                <div className="content has-text-left">
                    {
                        // Only display username if previous comment was from a different user
                        props.newUser ?
                            <>
                                <strong>{props.comment.name}</strong>
                                <br/>
                            </>
                            :
                            <></>
                    }
                    {props.comment.text}
                    <br/>
                    <p className="is-size-7">{Formatter.formatCommentDate(new Date(Date.parse(props.comment.timestamp)))}</p>
                </div>
            </div>
        </article>
    );
}

export default Comment;