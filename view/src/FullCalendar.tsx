import React from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid"; 
import timeGridPlugin from "@fullcalendar/timegrid"; 
import interactionPlugin from "@fullcalendar/interaction"; 
//import * as moment from 'moment'

interface Props {
}
interface State {
  showPopup:boolean
  active:boolean
  startDate:Date
  endDate:Date
  eventsarray:any[]
}

export default class FullCalendar extends React.Component<Props,State> {
  calendar:Calendar|undefined
  constructor(props: any) {
    super(props);
    this.state = {
      showPopup: false,
      active: false,
      startDate: new Date(),
      endDate: new Date(),
      eventsarray:[]
    };
  }
  
  action = () => {                                      //open and close modal
    this.setState((state) =>({active:!state.active}))
  };

  create(info: any,title: any) {    //open modal to set title of new event
    console.log(info.startStr);
    console.log(info.endStr);
    console.log(title);
    this.action();
    this.setState({startDate:info.startStr,endDate:info.endStr})
    //this.createEvent(info.startStr,title,info.endStr)
  }

  createEvent(/*startDate: Date, title: string, endDate: Date*/) {    //get title value, create event, add it to array and call update function
    const title=document.getElementById('titleinput') as HTMLInputElement
    //const titleinput=document.getElementById('titleinput') as HTMLInputElement
    //const startinput=document.getElementById('startinput') as HTMLInputElement
    //let title = titleinput.value ? "default"
    if(title.value)
    {
    console.log(title.value)
    const event = {
      title: title.value ? title.value : "Default",
      start: this.state.startDate,
      end:this.state.endDate,
      allDay:1
      //title: title.value,
      //start: startinput.value ? startinput.value: this.state.startDate,
      //allDay: endDate ? endDate : true // If there's no end date, the event will be all day of start date
    }  
    this.setState({
      eventsarray: [ ...this.state.eventsarray,event],
    });
    console.log(this.state.eventsarray);
    this.action();
    console.log(event)
    this.setEvents(event)
    alert('New event ' + title.value +' was added!')
  }
  else{
    alert('Please give a name for your event!')
  }
  }

  setEvents(data:any){
    /*Create call to backend route */
    fetch("http://localhost:9000/backend/events/add",{
      headers:{
        "accept":"application/json",
        "content-type":"application/json"
      },
      body: JSON.stringify(data),
      method:"POST"
    })
    .then(test=>{return test.json()}) //convert to json
    .then(res=>{console.log(res)})    //view response in console
    .then((data) => {
      console.log('Request succeeded with JSON response: ' + data);
      this.calendar?.removeAllEventSources()                    //remove old events
      this.calendar?.addEventSource(this.state.eventsarray)     //add new events
  })
    .catch(error=>console.log(error)) //catch errors
  }

  getEvents(){
    fetch("http://localhost:9000/backend/events/get")
    .then(res => {return res.json()})
    .then((data)=>{
    this.setState({eventsarray:data})
      console.log(this.state.eventsarray)
      this.calendar?.removeAllEventSources()                    //remove old events
      this.calendar?.addEventSource(this.state.eventsarray)     //add new events
      });
}

updateevent(properties:any){          //Update & deleted already created events --> TODO(optional)
  console.log(properties.event)
  console.log(properties.event.title)
  console.log(properties.event.id)
  /*fetch("http://localhost:9000/backend/events/update",{
    headers:{
      "accept":"application/json",
      "content-type":"application/json"
    },
    body: JSON.stringify(data),
    method:"POST"
  })*/
}

removeevent() {
  /*fetch("http://localhost:9000/backend/events/remove",{
    headers:{
      "accept":"application/json",
      "content-type":"application/json"
    },
    body: JSON.stringify(data),
    method:"POST"
  })*/
}
  

  componentDidMount(){
    this.initCalendar()
    this.getEvents();
  }

  initCalendar() {    //create calendar
    if(typeof this.calendar !== "undefined")    //check if calendar already exists. If exits: destroy old calendar and create new
    {
        console.log("Calendar already exist. Creating a new Calendar...");
        this.calendar.destroy();
    }
    const canvas=document.getElementById('calendarFull') as HTMLCanvasElement   //get Canvas Elemnt where Calendar will be displayed

    this.calendar = new Calendar(canvas, {
        initialView:"dayGridMonth",         //set initial view (Month view)
        firstDay:1,
        timeZone: 'local', 
        headerToolbar:{                     //set buttons for navigations/change views
          left: "prev,next",               
          center: "title",  
          right: "dayGridMonth,timeGridWeek,timeGridDay"    //today button?
        },
        eventTimeFormat: {  //event time format
          hour: '2-digit',     
          minute: '2-digit',  //Display time as e.g. 05:04 instead of 5:4
          hour12:false        //24h Format
        },
        slotLabelFormat:{ //calendar view time format
          hour: '2-digit',
          minute: '2-digit',
          hour12:false,
        },
      plugins:[dayGridPlugin, timeGridPlugin,interactionPlugin], //add plugins to fullcalendar 
      events:this.state.eventsarray,              //eventsList
      editable:true,              //editing events
      height:"500px",             //set height for table --> use auto?
       //selection                
      selectable: true,           //enable selection of dates
      select: (info)=>this.create(info,"SelectEvent"), //function on select --> run create function
      eventClick: (properties)=>this.updateevent(properties)
      }
    )
       this.calendar.render()   //render calendar on document
      }

      render() {    
        const active = this.state.active ? "is-active" : "";  //if active is true: show modal. Else hide it
        return (  
<div className="container">
  <div id='calendarFull'></div>
         <div className={`modal ${active}`} id="myModal">
            <div className="modal-background"></div>
                <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Modal title</p>
                    <button className="delete" aria-label="close" onClick={()=>this.action()}></button>   
                </header>
                <section className = "modal-card-body">
                    <div className = "content">
                <h1>Event Name</h1>
                <label className="label">Event</label>
                <div className="control">
                  <input
                    className="input"
                    id="titleinput"
                    type="text"
                    placeholder="e.g Neues Event"
                  />
</div>
</div>
</section>
        <footer className="modal-card-foot">
            <button className="button is-success" onClick={()=>this.createEvent()}>Save changes</button>
            <button className="button" onClick={()=>this.action()} >Cancel</button>
        </footer>
    </div>
    </div>
</div>
        )  
    }  
} 

