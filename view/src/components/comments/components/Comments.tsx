import Comment from './Comment'

interface Props {
    comments: any,
}
const Comments = ({comments}: Props) => {
    return (
        <>
             {comments.map((comment:any) => (
                 <Comment key={comment.id} comment={comment} />
             ))}
        </>
    )
}

export default Comments
