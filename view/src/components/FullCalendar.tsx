import React from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import DatePicker from "react-datepicker";
import en from "date-fns/locale/en-GB";
import "react-datepicker/dist/react-datepicker.css";
//import * as moment from 'moment'

interface Props {}
interface State {
  showPopup: boolean;
  active: boolean;
  title:string;
  startDate: Date;
  endDate: Date;
  date:Date;
  eventsarray: any[];
}

const initialState = {
  showPopup: false,
  active: false,
  title:'',
  startDate: new Date(),
  endDate: new Date(),
  eventsarray: [],
  date:new Date()
}

export default class FullCalendar extends React.Component<Props, State> {
  calendar: Calendar | undefined;
  constructor(props: any) {
    super(props);
    this.state = initialState
  }

  action = () => {
    //open and close modal
    console.log(this.state.active)
    this.setState((state) => ({ active: !state.active }));
  };

  close() {         //Abort or finish submit
    this.action()
    this.setState(initialState) //reset state to inital state
  }

  create(info: any, title: any) {
    //open modal to set title of new event
    console.log(info.startStr);
    console.log(info.endStr);
    console.log(title);
    this.action();
    this.setState({ startDate: info.startStr, endDate: info.endStr });
    //this.createEvent(info.startStr,title,info.endStr)
  }

  createEvent(/*startDate: Date, title: string, endDate: Date*/) {
    //get title value, create event, add it to array and call update function
    const title = document.getElementById("titleinput") as HTMLInputElement;
    //const titleinput=document.getElementById('titleinput') as HTMLInputElement
    //const startinput=document.getElementById('startinput') as HTMLInputElement
    //let title = titleinput.value ? "default"
    if (title.value) {
      console.log(title.value);
      const event = {
        title: title.value ? title.value : "Default",
        start: this.state.startDate,
        end: this.state.endDate,
        allDay: 1,
        //title: title.value,
        //start: startinput.value ? startinput.value: this.state.startDate,
        //allDay: endDate ? endDate : true // If there's no end date, the event will be all day of start date
      };
      this.setState({
        eventsarray: [...this.state.eventsarray, event],
      });
      console.log(this.state.eventsarray);
      this.action();
      console.log(event);
      this.setEvents(event);
      alert("New event " + title.value + " was added!");
    } else {
      alert("Please give a name for your event!");
    }
  }

  setEvents(data: any) {
    /*Create call to backend route */
    fetch("http://localhost:9000/backend/events/add", {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
      method: "POST",
    })
      .then((test) => {
        return test.json();
      }) //convert to json
      .then((res) => {
        console.log(res);
      }) //view response in console
      .then((data) => {
        console.log("Request succeeded with JSON response: " + data);
        this.close()
        this.getEvents()
      })
      .catch((error) => console.log(error)); //catch errors
  }

  getEvents() {
    fetch("http://localhost:9000/backend/events/get")
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        this.setState({ eventsarray: JSON.parse(response.body) });
        console.log(this.state.eventsarray);
        this.calendar?.removeAllEventSources(); //remove old events
        this.calendar?.addEventSource(this.state.eventsarray); //add new events
      });
  }

  updateevent(properties: any) {
    //Update & deleted already created events --> TODO(optional)
    console.log(properties.event);
    console.log(properties.event.title);
    console.log(properties.event.id);
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

  componentDidMount() {
    this.initCalendar();
    this.getEvents();
  }

  initCalendar() {
    //create calendar
    if (typeof this.calendar !== "undefined") {
      //check if calendar already exists. If exits: destroy old calendar and create new
      console.log("Calendar already exist. Creating a new Calendar...");
      this.calendar.destroy();
    }
    const canvas = document.getElementById("calendarFull") as HTMLCanvasElement; //get Canvas Elemnt where Calendar will be displayed

    this.calendar = new Calendar(canvas, {
      initialView: "dayGridMonth", //set initial view (Month view)
      firstDay: 1,
      timeZone: "local",
      headerToolbar: {
        //set buttons for navigations/change views
        left: "prev,next",
        center: "title",
        right: "dayGridMonth,timeGridWeek,today", //today button?
      },
      eventTimeFormat: {
        //event time format
        hour: "2-digit",
        minute: "2-digit", //Display time as e.g. 05:04 instead of 5:4
        hour12: false, //24h Format
      },
      slotLabelFormat: {
        //calendar view time format
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      },
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin], //add plugins to fullcalendar
      events: this.state.eventsarray, //eventsList
      editable: true, //editing events
      height: "500px", //set height for table --> use auto?
      //selection
      selectable: true, //enable selection of dates
      select: (info) => this.create(info, "SelectEvent"), //function on select --> run create function
      eventClick: (properties) => this.updateevent(properties),
    });
    this.calendar.render(); //render calendar on document
  }

  handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
        [name]: value
    } as unknown as Pick<State, keyof State>);
    console.log(this.state.title)
}

  render() {
    const active = this.state.active ? "is-active" : ""; //if active is true: show modal. Else hide it
    return (
      <div className="container">
        <div id="calendarFull"></div>
        <div className={`modal ${active}`} id="CalendarModal">
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Create Event</p>
              <button
                className="delete"
                aria-label="close"
                onClick={() => this.close()}
              ></button>
            </header>
            <section className="modal-card-body">
              <div className="content">
                <label className="label">Event Name</label>
                <div className="control">
                  <>
                  <input
                    className="input"
                    id="titleinput"
                    name="title"
                    type="text"
                    placeholder="Event title"
                    value={this.state.title}
                    onChange={(title)=>this.handleOnChange(title)}
                  />
                  </>
                  <label className="label">Event Time</label>
                  <>
                  <DatePicker
                    dateFormat="dd.MM.yyyy HH:mm"
                    showTimeSelect
                    //timeIntervals={15}
                    timeFormat="HH:mm"
                    selected={this.state.date}
                    locale={en}
                    onChange={(date: Date) => this.setState({date: date})}
                    inline
                />
                  </>
                </div>
              </div>
            </section>
            <footer className="modal-card-foot">
              <button
                className="button is-success"
                onClick={() => this.createEvent()}
              >
                Save changes
              </button>
              <button className="button" onClick={() => this.action()}>
                Cancel
              </button>
            </footer>
          </div>
        </div>
      </div>
    );
  }
}
