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
  eventsarray:[]
}

const events = [{ title: "Today",allDay:false, date: new Date()},
  {     title: "Event 02",
        start: new Date('2021-05-17'),
        allDay: true,
        end: new Date('2021-05-20')
},
  {     title: "Neues Event",
        start: "2021-04-17",
        allDay: true,
        end: "2021-04-20"
      },
  {
    title: "Event 01",
    start: "2021-05-10",
    allDay: true,
    end: "2021-05-15",
  }]; 

export default class CalendarDemo extends React.Component<Props,State> {
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
  
  action = () => {
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
    if(title.value)
    {
    console.log(title.value)
    const event = {
      title: title.value,
      start: this.state.startDate,
      end:this.state.endDate,
      allDay:true
      //allDay: endDate ? endDate : true // If there's no end date, the event will be all day of start date
    }
    events.push(event);
    this.action();
    console.log(event)
    this.setEvents(event)
    this.updateCalendar(events)
    alert('Neues Event wurde erstellt!')
  }
  else{
    alert('Bitte geben Sie ein Wert für den Titel an')
  }
  }

  setEvents(data:any){
    let test={
      title: "foo",
      start: "2021-05-10", 
      end: "2021-05-10",
      allDay: true
    }
    /*Create call to backend route */
    fetch("http://localhost:9000/backend/events/update",{
      headers:{
        "accept":"application/json",
        "content-type":"application/json"
      },
      body: JSON.stringify(data),
      method:"POST"
    })
    .then(test=>{return test.json()}) //convert to json
    .then(res=>{console.log(res)})    //data in console
    .then(function(data) {
      console.log('Request succeeded with JSON response: ' + data);
  })
    .catch(error=>console.log(error)) //catch errors
  }

  getEvents(){
    var items: any[]
    fetch("http://localhost:9000/backend/events/get")
    //.then(res => res.text())
    //.then(res=>console.log(res))
    .then(res => {return res.json()})
    .then((data)=>{
      items: data.map((item: any) => ({
        title:item.title,
        startdate:item.startdate,
        enddate:item.enddate
      }));
      console.log(data)
    })
}

updateevent(event:any){
  console.log(event)
}
  

  componentDidMount(){
    this.getEvents();
    this.updateCalendar(events)
  }

  updateCalendar(events:any) {    //create calendar/ update if exists
    console.log(events)
    if(typeof this.calendar !== "undefined")    //check if calendar already exists. If exits: destroy old calendar and create new
    {
        console.log("Calendar already exist. Creating a new Calendar...");
        this.calendar.destroy();
    }
    const canvas=document.getElementById('calendarFull') as HTMLCanvasElement   //get Canvas Elemnt where Calendar will be displayed

    this.calendar = new Calendar(canvas, {
        initialView:"dayGridMonth",         //set initial view (Month view)
        firstDay:1,
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
      events:events,              //eventsList
      editable:true,              //editing events
      height:"500px",             //set height for table --> use auto?
       //selection                
      selectable: true,           //enable selection of dates
      select: (info)=>this.create(info,"SelectEvent"), //function on select --> run create function
      eventClick: (event)=>this.updateevent(event)
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

