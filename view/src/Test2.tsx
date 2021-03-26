import React, { useEffect } from 'react';
import 'bulma/css/bulma.css';
import 'bulma-extensions/bulma-calendar/dist/css/bulma-calendar.min.css';
//import 'bulma-extensions/bulma-calendar/dist/js/bulma-calendar-min.js';

//var bulmaCalendar=require('bulma-extensions/bulma-calendar/dist/js/bulma-calendar-min.js');

function Dob({ className="test" }) {
  /*  useEffect(() => {
      // Initialize all input of date type.
      const calendars = bulmaCalendar.attach('[type="date"]', {});
  
      // Loop on each calendar initialized
      calendars.forEach((calendar: { on: (arg0: string, arg1: (date: any) => void) => void; }) => {
        // Add listener to date:selected event
        calendar.on('date:selected', (date: any) => {
          console.log(date);
        });
      });
  
      // To access to bulmaCalendar instance of an element
      // eslint-disable-next-line no-undef
      const element = document.querySelector('#dob');
      if (element) {
        // bulmaCalendar instance is available as element.bulmaCalendar
       /* element.bulmaCalendar.on('select', (datepicker: { data: { value: () => any; }; }) => {
          console.log(datepicker.data.value());
        });*/
     /* }
    }, []);
  
    return (
      <div className={className}>
        <p className="subtitle is-5">Date of Birth</p>
        <input id="dob" type="date" />
      </div>
    );
    */
  }
  
  export default Dob;

/*
document.addEventListener( 'DOMContentLoaded', function () {

    var datePicker = new bulmaCalendar( document.getElementById( 'datepickerDemo' ), {
      startDate: new Date(), // Date selected by default
      dateFormat: 'yyyy-mm-dd', // the date format `field` value
      lang: 'en', // internationalization
      overlay: false,
      closeOnOverlayClick: true,
      closeOnSelect: true,
      // callback functions
      onSelect: null,
      onOpen: null,
      onClose: null,
      onRender: null
    } );
    var datePicker = new bulmaCalendar( document.getElementById( 'datepickerDemo2' ), {
      overlay: true
    } );
  } );

  */

  /*
  // Initialize all input of type date
var calendars = bulmaCalendar.attach('[type="date"]', []);

// Loop on each calendar initialized
for(var i = 0; i < calendars.length; i++) {
    // Add listener to date:selected event
    calendars[i].on('select', date => {
        console.log(date);
    });
}

// To access to bulmaCalendar instance of an element
var element = document.querySelector('#my-element');
if (element) {
    // bulmaCalendar instance is available as element.bulmaCalendar
    element.bulmaCalendar.on('select', function(datepicker) {
        console.log(datepicker.data.value());
    });
}
});
  
  */