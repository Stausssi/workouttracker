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
            <>
                <Head/>
                <div id="body-content" className="flexColumns">
                    <div className="mainColumn" id="col-1">
                        <FeedContainer/>
                    </div>
                    <div className="mainColumn" id="col-2">
                        <Calendar/>
                        <Graphs/>
                    </div>
                </div>
                <Foot/>
            </>
        )
    }
}

export default Homepage

