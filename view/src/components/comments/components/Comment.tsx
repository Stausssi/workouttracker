interface Props {
    comment: any,
}
//comment component format timestamp and comment and style with bulma comment component
const Comment = ({ comment }: Props) => {
    return (
        <article className="media">
            <div className="media-content">
                <div className="content has-text-left">
                        <strong>{comment.name}</strong>
                        <br></br>
                        {comment.text}
                        <br></br>
                        <p className="is-size-7">{comment.timestamp.replace("T", " ").replace(".000Z", "")}</p>
                </div>
            </div>
        </article>
    )
}

export default Comment
