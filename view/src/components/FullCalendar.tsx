import React from "react";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import NotificationBox from "./notificationBox";
import { BACKEND_URL } from "../App"; //TODO add Backend URL const to fetch
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import SessionHandler from "../SessionHandler";

interface Props {}

interface State {
  active: boolean;
  title: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  date: Date;
  eventsarray: any[];
  informtext: string;
  informtype: string;
}

const initialState = {
  active: false,
  title: "",
  startDate: new Date(),
  endDate: new Date(),
  allDay: false,
  eventsarray: [],
  date: new Date(),
  informtext: "",
  informtype: "",
};

export default class FullCalendar extends React.Component<Props, State> {
  calendar: Calendar | undefined;
  constructor(props: any) {
    super(props);
    this.state = initialState; //init state
  }

  action = () => {
    //open and close modal
    console.log(this.state.active);
    this.setState((state) => ({ active: !state.active }));
  };

  close() {
    //close modal on submit aborted or finished
    this.action();
    this.setState(initialState); //reset state to inital state
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
    const canvas = document.getElementById("calendarFull") as HTMLCanvasElement; //get Canvas Element where Calendar will be displayed

    this.calendar = new Calendar(canvas, {
      initialView: "dayGridMonth", //set initial view (Month view)
      firstDay: 1,
      timeZone: "local",
      headerToolbar: {
        //set buttons for navigations/change views
        left: "prev,next",
        center: "title",
        right: "dayGridMonth,timeGridWeek,today", //views: month, week, today (display month/week of actual Day)
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
      height: "600px", //set height for table --> use auto?
      //selection
      selectable: true, //enable selection of dates
      select: (info) => this.create(info), //function on select --> run create function
      //eventClick: (properties) => this.updateevent(properties),
      eventDidMount: (element) => {
        console.log(element.event.id);
        console.log(element.event.title);
        var deleteButton = document.createElement("button");
        deleteButton.onclick = () => this.removeevent(element);
        deleteButton.className = "delete";
        element.el.append(deleteButton);
      },
    });
    this.calendar.render(); //render calendar on document
  }

  create(info: any) {
    //open modal to set title of new event
    //var startdate=moment(info.start,'YYYY-MM-DD HH:mm').toDate();
    //var enddate=moment(info.end,'YYYY-MM-DD HH:mm').toDate();
    this.action();
    this.setState({ startDate: info.startStr, endDate: info.endStr });
  }

  createEvent() {
    const event = {
      title: this.state.title,
      start: this.state.startDate,
      end: this.state.endDate,
      allDay: 1, //this.state.allDay, //TODO: allow to define start and end time
    };
    this.action();
    console.log(event);
    this.setEvents(event);
  }

  getEvents() {
    fetch(BACKEND_URL + "/events/get", {
      method: "GET",
      headers: {
        Accept: "application/json",
        //Authorization: SessionHandler.getAuthToken()
      },
    }).then((response) => {
      if (response.ok) {
        return response.json().then((response) => {
          this.setState({ eventsarray: JSON.parse(response.body) });
          console.log(this.state.eventsarray);
          this.calendar?.removeAllEventSources(); //remove old events
          this.calendar?.addEventSource(this.state.eventsarray); //add new events
        });
      } else {
        return response.json().then((response) => {
          console.error("Fetch has failed:", response);
          this.setState({ eventsarray: [] });
        });
      }
    });
  }

  setEvents(data: any) {
    /*Create call to backend route */
    fetch(BACKEND_URL + "events/add", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
         //Authorization: SessionHandler.getAuthToken()
      },
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.ok) {
        this.setState({
          informtext: "Event was successfully added to Database",
          informtype: "is-success",
        });
      } else {
        return response.json().then((response) => {
          this.setState({
            informtext:
              "Event could not be added to database. Please contact an administrator for more information. Error is: " +
              response,
            informtype: "is-danger",
          });
        });
      }
      this.close(); //reset state when setEvents has end
      this.getEvents();
    });
  }

  removeevent(element: any) {
    element.event.remove();
    fetch(BACKEND_URL + "events/remove", {
      method: "DELETE",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
         //Authorization: SessionHandler.getAuthToken()
      },
      body: JSON.stringify({ id: element.event.id }),
    }).then((response) => {
      if (response.ok) {
        console.log("Delete request has been submitted successfully");
      } else {
        console.log("Delete request has failed: " + response);
      }
    });
  }

  handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState(({
      [name]: value,
    } as unknown) as Pick<State, keyof State>);
    console.log(this.state.allDay);
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
                <div className="control">
                  <label className="label">Event Name</label>
                  <>
                    <input
                      className="input"
                      id="eventtitle"
                      name="title"
                      type="text"
                      placeholder="Event title"
                      value={this.state.title}
                      onChange={(title) => this.handleOnChange(title)}
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
                <FontAwesomeIcon icon={faCheck} />
                <span className="m-2">Save</span>
              </button>
              <button
                className="button is-danger"
                onClick={() => this.action()}
              >
                <FontAwesomeIcon icon={faTimes} />
                <span className="m-2">Cancel</span>
              </button>
            </footer>
            <NotificationBox
              message={this.state.informtext}
              type={this.state.informtype}
              hasDelete={false}
            />
          </div>
        </div>
      </div>
    );
  }
}
