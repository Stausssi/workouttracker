import React, { Component } from 'react'  
import FullCalendar from "@fullcalendar/react";  
import dayGridPlugin from "@fullcalendar/daygrid"; 
import timeGridPlugin from "@fullcalendar/timegrid"; 
import interactionPlugin from "@fullcalendar/interaction"; 
const events = [{ title: "Today", date: new Date() }];  
export class Calendar1 extends Component {  
    handleDateClick = (arg: { dateStr: any; }) => { 
        alert(arg.dateStr)
      }

      renderEventContent(eventInfo: { timeText: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; event: { title: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined; }; }) {
        return (
          <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
          </>
        )
      }
    render() {  
        return (  
            <div className="container">   
                 <FullCalendar  
              initialView="dayGridMonth"  
             headerToolbar={{  
            left: "prev,next",  
            center: "title",  
           right: "dayGridMonth,timeGridWeek,timeGridDay"  
        }}  
        plugins={[dayGridPlugin, timeGridPlugin,interactionPlugin]}  
        events={events}  
        dateClick={this.handleDateClick}
        eventContent={this.renderEventContent}
      />  
            </div>  
        )  
    }  
}  

export default Calendar1  