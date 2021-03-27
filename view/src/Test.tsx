import React from 'react';
import Head from './Head';
import Foot from './Foot';

class Test extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            value: 0,
            text: '',
        };
    }
    render() {
        return (

            <section className='main'>
                <Head></Head>
                <div className="column is-4">
  <div className="calendar">
  <div className="calendar-nav">
    <div className="calendar-nav-left">
      <button className="button is-link">
        <i className="fa fa-chevron-left"></i>
      </button>
    </div>
    <div>March 2017</div>
    <div className="calendar-nav-right">
      <button className="button is-link">
        <i className="fa fa-chevron-right"></i>
      </button>
    </div>
  </div>
  <div className="calendar-container">
    <div className="calendar-header">
      <div className="calendar-date">Sun</div>
      <div className="calendar-date">Mon</div>
      <div className="calendar-date">Tue</div>
      <div className="calendar-date">Wed</div>
      <div className="calendar-date">Thu</div>
      <div className="calendar-date">Fri</div>
      <div className="calendar-date">Sat</div>
    </div>
    <div className="calendar-body">
      <div className="calendar-date is-disabled"><button className="date-item">1</button></div>
    </div>
  </div>
</div>
</div>

<br /><br />
<div className="calendar is-calendar-large">
  <div className="calendar-nav">
    <div className="calendar-nav-left">
      <button className="button is-link">
        <i className="fa fa-chevron-left"></i>
      </button>
    </div>
    <div>March 2017</div>
    <div className="calendar-nav-right">
      <button className="button is-link">
        <i className="fa fa-chevron-right"></i>
      </button>
    </div>
  </div>
  <div className="calendar-container">
    <div className="calendar-header">
      <div className="calendar-date">Sun</div>
    </div>
    <div className="calendar-body">
      <div className="calendar-date disabled"><button className="date-item">26</button></div>
      <div className="calendar-date disabled">
        <button className="date-item">27</button>
        <div className="calendar-events">
          <a className="calendar-event">Default event</a>
        </div>
      </div>
      <div className="calendar-date disabled"><button className="date-item">28</button></div>
      <div className="calendar-date"><button className="date-item">1</button></div>
      <div className="calendar-date"><button className="date-item">2</button></div>
      <div className="calendar-date tooltip" data-tooltip="You have appointments">
        <button className="date-item badge">8</button>
        <div className="calendar-events">
          <a className="calendar-event is-primary">Primary event</a>
          <a className="calendar-event is-warning">Warning event</a>
          <a className="calendar-event is-danger">Danger event</a>
        </div>
      </div>
      <div className="calendar-date"><button className="date-item">11</button></div>
      <div className="calendar-date">
        <button className="date-item">12</button>
        <div className="calendar-events">
          <a className="calendar-event">Default event</a>
        </div>
      </div>
      <div className="calendar-date calendar-range range-end">
        <button className="date-item is-active">20</button>
        <div className="calendar-events">
          <a className="calendar-event is-success">Success event</a>
        </div>
      </div>
      <div className="calendar-date"><button className="date-item">21</button></div>
      <div className="calendar-date"><button className="date-item">31</button></div>
      <div className="calendar-date disabled">
        <button className="date-item">1</button>
        <div className="calendar-events">
          <a className="calendar-event">Second default event</a>
        </div>
      </div>
    </div>
  </div>
</div>


                <Foot></Foot>
            </section>
        )
    }
}

export default Test

