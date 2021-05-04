import React from "react";
import {Calendar} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {BACKEND_URL} from "../App";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import NotificationBox from "./NotificationBox";
import SessionHandler from "../utilities/SessionHandler";

interface Props {
}

interface State {
    active: boolean;
    title: string;
    startDate: Date;
    endDate: Date;
    date: Date;
    activityEvents: any[];
    notifyMessage: string;
    notifyType: string;
}

const initialState = {
    active: false,
    title: "",
    startDate: new Date(),
    endDate: new Date(),
    activityEvents: [],
    date: new Date(),
    notifyMessage: "",
    notifyType: "",
};

export default class FullCalendar extends React.Component<Props, State> {
    private readonly abortController: AbortController;

    calendar: Calendar | undefined;

    constructor(props: any) {
        super(props);
        this.state = initialState; //init state
        this.abortController = new AbortController();
    }

    //open and close modal
    action = () => {
        let active = !this.state.active;
        if (active) {
            this.setState(() => ({active: active}));
        } else {
            this.setState(initialState); // reset state on close
        }
    };

    componentDidMount() {
        this.initCalendar();
        this.getEvents();
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    //create calendar
    initCalendar() {
        if (typeof this.calendar !== "undefined") {                 //check if calendar already exists. If exits: destroy old calendar and create new
            this.calendar.destroy();
        }
        const canvas = document.getElementById("calendarFull") as HTMLCanvasElement; //get Canvas Element where Calendar will be displayed
        this.calendar = new Calendar(canvas, {
            initialView: "dayGridMonth", //set initial view (Month view)
            firstDay: 1, //set first day on Monday
            dayMaxEvents: 2, //set max events to show per day. Other events display in popup
            timeZone: "local",
            headerToolbar: {        //set buttons for navigations/change views
                left: "prev,next",
                center: "title",
                right: "today", //today (to display month of actual day. Disabled if actual month is already displayed)
            },
            eventTimeFormat: {      //event time format
                hour: "2-digit",
                minute: "2-digit", //Display time as e.g. 05:04 instead of 5:4
                hour12: false, //24h Format
            },
            slotLabelFormat: {   //calendar view time format
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            },
            defaultAllDay: true,
            plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin], //add plugins to fullcalendar
            contentHeight: "auto",        
            selectable: true,           //enable selection of dates
            select: (info) => this.create(info), //Open create function on select date range
            eventDidMount: (element) => {       // add delete button to events
                let deleteButton = document.createElement("button");
                deleteButton.onclick = () => this.removeEvent(element); //remove event
                deleteButton.className = "delete";
                element.el.append(deleteButton);
            },
        });
        this.calendar.render(); //render calendar on document
    }

    //Get selected dates and open modal to set title of new event
    create(info: any) {
        this.setState({startDate: info.startStr, endDate: info.endStr});
        this.action();
    }

    //create event
    createEvent() {
        if (this.state.title && this.state.title !== "") {
            const event = {
                title: this.state.title,
                start: this.state.startDate,
                end: this.state.endDate,
            };
            this.setEvents(event);
        } else {
            this.setState({
                notifyMessage: "Title can not be empty",
                notifyType: "is-danger",
            });
        }
    }

    //get activities as events
    getActivity() {
        fetch(BACKEND_URL + "activity/get", {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: SessionHandler.getAuthToken(),
            },
            signal: this.abortController.signal,
        }).then((response) => {
            if (response.ok) {
                let activityEvents: any[] = [];
                return response.json().then((response) => {
                    let posts = JSON.parse(response.body);
                    posts.map((item: any) => {                  //get end date of activity with duration and format result
                        let end = moment(item.startedAt)
                            .add(item.duration, "seconds")
                            .format("YYYY-MM-DD HH:mm:ss");
                        const event = {
                            id: item.activity_id,
                            title: item.title,
                            start: item.startedAt,
                            end: end,
                            groupId: "activityEvents",
                            color: "green",
                        };
                        activityEvents.push(event);     //add activities to array
                        return event;
                    });
                    this.calendar?.addEventSource(activityEvents); //add array as event source
                });
            } else {
                return response.json().then((response) => {
                    console.error("Fetch has failed:", response);
                    this.setState({activityEvents: []});
                });
            }
        });
    }

    //get events from DB
    getEvents() {
        fetch(BACKEND_URL + "events/get", {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: SessionHandler.getAuthToken(),
            },
            signal: this.abortController.signal,
        }).then((response) => {
            if (response.ok) {
                return response.json().then((response) => {
                    this.calendar?.removeAllEventSources(); //remove old events
                    this.calendar?.addEventSource(JSON.parse(response.body)); //add new events
                    this.getActivity(); //get events fom activity
                });
            } else {
                return response.json().then((response) => {
                    console.error("Fetch has failed:", response);
                });
            }
        });
    }

    //Add new event to database
    setEvents(data: any) {
        fetch(BACKEND_URL + "events/add", {
            method: "POST",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization: SessionHandler.getAuthToken(),
            },
            body: JSON.stringify(data),
            signal: this.abortController.signal,
        }).then((response) => {
            if (!response.ok) {
                return response.json().then((response) => {
                    console.error(
                        "Event could not be added to database. Please contact an administrator for more information. Error is: " +
                        response
                    );
                });
            }
            this.action(); //close modal
            this.getEvents(); //render events to update
        });
    }

    //remove event from database
    removeEvent(element: any) {
        if (element.event.groupId === "activityEvents") {
            element.event.remove(); //remove on frontend
            fetch(BACKEND_URL + "activity/remove", {        //remove an activity from database
                method: "DELETE",
                headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                    Authorization: SessionHandler.getAuthToken(),
                },
                body: JSON.stringify({id: element.event.id}),
                signal: this.abortController.signal,
            }).then((response) => {
                if (response.ok) {
                    SessionHandler.setRefreshFeed(true);        //Update frontend
                } else {
                    console.error("Delete request has failed");
                }
            });
        } else {
            element.event.remove(); //remove on frontend
            fetch(BACKEND_URL + "events/remove", {  //remove an event from database
                method: "DELETE",
                headers: {
                    accept: "application/json",
                    "content-type": "application/json",
                    Authorization: SessionHandler.getAuthToken(),
                },
                body: JSON.stringify({id: element.event.id}),
                signal: this.abortController.signal,
            }).then((response) => {
                if (!response.ok) {
                    console.error("Delete request has failed");
                }
            });
        }
    }

    //Update state on change in a input field
    handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(({
            [name]: value,
        } as unknown) as Pick<State, keyof State>);
    }

    render() {
        const active = this.state.active ? "is-active" : ""; //if active is true: show modal. Else hide it
        return (
            <div className="box m-5">
                <div id="calendarFull"/>
                <div className={`modal ${active}`} id="CalendarModal">
                    <div className="modal-background"/>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Create Event</p>
                            <button
                                className="delete"
                                aria-label="close"
                                onClick={() => this.action()}
                            />
                        </header>
                        <section className="modal-card-body">
                            <div className="content">
                                <div className="control">
                                    <NotificationBox
                                        message={this.state.notifyMessage}
                                        type={this.state.notifyType}
                                        hasDelete={false}
                                    />
                                    <label className="label">Event Name</label>
                                    <>
                                        <input
                                            className="input"
                                            id="eventTitle"
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
                                <FontAwesomeIcon icon={faCheck}/>
                                <span className="m-2">Save</span>
                            </button>
                            <button
                                className="button is-danger"
                                onClick={() => this.action()}
                            >
                                <FontAwesomeIcon icon={faTimes}/>
                                <span className="m-2">Cancel</span>
                            </button>
                        </footer>
                    </div>
                </div>
            </div>
        );
    }
}
