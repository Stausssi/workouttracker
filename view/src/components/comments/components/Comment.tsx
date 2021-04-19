interface Props {
    comment: any,
}
const Comment = ({ comment }: Props) => {
    return (
        <div className='message'>
            <div className='message-body'>
                <h3>{comment.text}</h3>
                <p>{comment.name} | {comment.timestamp.replace("T", " ").replace(".000Z", "")}</p>
            </div>
        </div>
    )
}

export default Comment
