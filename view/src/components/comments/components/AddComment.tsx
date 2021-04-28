import { useState } from 'react'
import {BACKEND_URL, FRONTEND_URL} from "../../../App";
import SessionHandler from "../../../utilities/SessionHandler";

interface Props {
    onAdd: any,
}

//add new comment in the front and backend
const AddComment = ({ onAdd }: Props) => {
    const [text, setText] = useState('')
    const [countLengt, setCountLengt] = useState(500)

    const onSubmit = (e:any) => {
        e.preventDefault()

        if(!text) {
            alert('Please add text')
            return
        }

        //built timestamp formatted in the db to insert faster in the frontend
        const Now = new Date();
        const Day = Now.getUTCDay();
        const Month = Now.getUTCMonth() +1;
        var Year = Now.getUTCFullYear();
        const Hours = Now.getUTCHours();
        const Minutes = Now.getUTCMinutes();
        const Seconds = Now.getUTCSeconds();
        if (Year < 1900) {
            Year += 1900;
        }
        const timestamp = Year + "-" + Month + "-" + Day + " " + Hours + ":" + Minutes + ":" + Seconds;

        if(SessionHandler.getUser()){
            // @ts-ignore
            const name = SessionHandler.getUser().username.toString();
            //insert in frontend to show the comment fast as possible
            onAdd({ text, name, timestamp })

            //insert in backend
            fetch(BACKEND_URL + 'commend', {
                method: 'POST',
                headers:{
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: SessionHandler.getAuthToken()
                },
                body: JSON.stringify({
                    text: text,
                    activity: 48,
                }),
            });
        }

        //set to default values
        setText('')
        setCountLengt(500);
    }

    
    //update counter and input field
    const onKeyUp = (e:any) => {
        setText(e.target.value);
        e.preventDefault()
        setCountLengt(500 - e.target.value.length);
    }

    return (
        <form className='box' onSubmit={onSubmit}>
            <div className='field'>
                <label className="label">Comment</label>
                <input className="input" type='text' maxLength={500} placeholder='Add your comment' value={text} onChange={(e) => onKeyUp(e)} />
                <p>{countLengt}</p>
            </div>
            <input  className='button is-black is-outlined'  type='submit' placeholder='Insert Comment'/>
        </form>
    )
}

export default AddComment