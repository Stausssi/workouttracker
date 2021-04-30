interface Props {
    comment: any,
    newUser: boolean
}

//comment component format timestamp and comment and style with bulma comment component
const Comment = (props: Props) => {
    function formatTime(timestamp: any) {
        function fillZeros(num: number) {
            return num < 10 ? "0" + num : num;
        }

        timestamp = new Date(Date.parse(timestamp));

        let formattedTime = "";
        let diffInM = Math.round((new Date().getTime() - timestamp.getTime()) / 1000 / 60);

        if (diffInM === 0) {
            return "Just now";
        } else if (diffInM < 60) {
            formattedTime = diffInM + " minute" + (diffInM === 1 ? "" : "s");
        } else {
            let diffInH = Math.round(diffInM / 60);
            if (diffInH < 24) {
                formattedTime = diffInH + " hour" + (diffInH === 1 ? "" : "s");
            } else {
                let diffInD = Math.round(diffInH / 24);
                if (diffInD < 15) {
                    formattedTime = diffInD + " day" + (diffInD === 1 ? "" : "s");
                } else {
                    return fillZeros(timestamp.getDay()) + "." + fillZeros(timestamp.getMonth()) + "." + timestamp.getUTCFullYear();
                }
            }
        }

        return formattedTime + " ago";
    }

    return (
        <article className="media">
            <div className="media-content">
                <div className="content has-text-left">
                    {
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
                    <p className="is-size-7">{formatTime(props.comment.timestamp)}</p>
                </div>
            </div>
        </article>
    );
}

export default Comment