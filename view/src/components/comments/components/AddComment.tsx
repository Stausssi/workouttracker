import { useState } from 'react'
import SessionHandler from "../../../utilities/SessionHandler";
import {BACKEND_URL, FRONTEND_URL} from "../../../App";

interface Props {
    onAdd: any,
}

//add new comment in the front and backend
const AddComment = ({ onAdd }: Props) => {
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [countLengt, setCountLengt] = useState(500)

    const onSubmit = (e:any) => {
        e.preventDefault()

        if(!text) {
            alert('Please add text')
            return
        }
        var Now = new Date();
        var Tag = Now.getDate();
        var Monat = Now.getMonth() +1;
        var Year = Now.getFullYear();
        var Stunden = Now.getHours();
        var Minuten = Now.getMinutes();
        if (Year < 1900) {
            Year += 1900;
        }
    
        const timestamp = Tag + "." + Monat + "." + Year + " " + Stunden + ":" + Minuten;
        //const timestamp = new Date().getTime();

        //insert in frontend
        onAdd({ text, name, timestamp })

        //insert in backend
        fetch(BACKEND_URL + '/commend', {
            method: 'POST',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: SessionHandler.getAuthToken() 
            },
            body: JSON.stringify({
                text: text,
                activity: 12,
            }),
        });

        //set to default values
        setText('')
        setName('')
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
            <div className='field'>
                <label className="label">Name</label>
                <input className="input" type='text' placeholder='Add your Name' value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <input  className='button is-black is-outlined'  type='submit' placeholder='Insert Comment'/>
        </form>
    )
}

export default AddComment