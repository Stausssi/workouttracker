import React, { useState } from 'react'
import { Calendar, View, DateLocalizer } from 'react-big-calendar'
import moment from 'moment';

const allViews: View[] = ['agenda', 'day', 'week', 'month'];

interface Props {
    localizer: DateLocalizer;
}

class CalendarEvent {
    title: string;
    allDay: boolean;
    start: Date;
    end: Date;
    desc: string;
    resourceId?: string;
    tooltip?: string;

    constructor(_title: string, _start: Date, _endDate: Date, _allDay?: boolean, _desc?: string, _resourceId?: string) {
        this.title = _title;
        this.allDay = _allDay || false;
        this.start = _start;
        this.end = _endDate;
        this.desc = _desc || '';
        this.resourceId = _resourceId;
    }
  }


export default function SelectableCalendar ({ localizer }: Props) {
    const [events, setEvents] = useState([] as CalendarEvent[]);
    var start:Date
    var end:Date
    function handleSelect({start:{},end:{}}) {
        const title = window.prompt('New Event name');

        if (title) {
            let newEvent = {} as CalendarEvent;
            newEvent.start = moment(start).toDate();
            newEvent.end = moment(end).toDate();
            newEvent.title = title;

            // Erroneous code:
            //     events.push(newEvent)
            //     setEvents(events)
            setEvents([
                ...events,
                newEvent
            ]);
        }
    }

    return (
      <>
        <div>
          <strong>
            Click an event to see more info, or drag the mouse over the calendar
            to select a date/time range.
          </strong>
        </div>
        <Calendar
          selectable
          localizer={localizer}
          events={events}
          defaultView='month'
          views={allViews}
          defaultDate={new Date(2020, 4, 21)}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={handleSelect}
          startAccessor='start'
          endAccessor='end'
          titleAccessor='title'
        />
      </>
    )
  }