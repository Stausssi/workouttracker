import React from 'react';
import Head from "../components/Head";
import Foot from '../components/Foot';
import FeedContainer from "../components/Feed/FeedContainer";
import Calendar from "../components/FullCalendar";
import Graphs from "../components/Charts";

//Page where User can see after login. Integration of Head, Body and Foot.

class Homepage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <section className='main'>
                <Head/>
                <section id="body-content">
                    <div id="col-1">
                        <FeedContainer/>
                    </div>
                    <div id="col-2">
                        <div id="calendarcontainer">
                            <Calendar/>
                        </div>
                        <div id="chartscontainer">
                            <Graphs/>
                        </div>
                    </div>
                </section>
                <Foot/>
            </section>
        )
    }
}

export default Homepage

