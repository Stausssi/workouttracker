import React from "react";

interface Props {
}

export class OwnFeed extends React.Component<{}> {
    render() {
        return (
            <>
                <div className="pr-4 pl-4 pt-1 pb-1">
                    <div>Hier kommt die eigene Aktivität hin</div>
                    <div>Weitere eigene Komponenten</div>

                    <ActivityBox />
                </div>

            </>
        );
    }
}

export class FriendsFeed extends React.Component<Props> {
    render() {
        return (
            <>
                <div>Hier kommt die Aktivitäten der Freunde hin</div>
                <div>Weitere andere Komponenten</div>
            </>
        );
    }
}

//Component for an activity Box, to contain a like button, comment section and an activity table
class ActivityBox extends React.Component<any, any>{
    render() {
        return(
            <>
                <div className="card">
                    <div className="card-content">
                        <div className="media">
                            <figure className="image is-48x48">
                                <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image"/>
                            </figure>
                            <div className="media-content has-text-left	pl-2">
                                <p className="title is-4">Sportart</p>
                                <p className="subtitle is-6">
                                    <time dateTime="2016-1-1">11:09 PM - 1 Jan 2016 </time>
                                    - Niklas Drössler
                                </p>
                            </div>
                            <div className="">
                                <button className="button is-success is-rounded">Like</button>
                            </div>
                        </div>

                        <div className="content ">
                            <ActivityTable activityData={{ duration: 200, pace: 20, averageHeartRate: 50, altitudeDifference: 10}}/>
                        </div>
                    </div>
                        <div className="card">
                            <header className="card-header">
                                <p className="card-header-title">
                                    Comments
                                </p>
                                <button className="card-header-icon" aria-label="more options">
                                <span className="icon">
                                    <i className="fas fa-angle-down" aria-hidden="true"/>
                                </span>
                                </button>
                            </header>
                        </div>
                </div>
            </>
        );
    }
}

interface activityData {
    distance?: number,
    duration?: number,
    pace?: number,
    averageHeartRate?: number,
    altitudeDifference?: number
}

interface props {
    activityData: activityData
}

//displays an activity table
class ActivityTable extends React.Component<props, { }>{
    constructor(props: props) {
        super(props);
    }

    renderTableHeaders(activityData: activityData){
        let keys = Object.keys(activityData) //get property keys
        return keys.map((key) => <th>{key}</th>)
    }

    renderTableContents(activityData: activityData){
        let values = Object.values(activityData) //get property values
        return values.map((value) => <th>{value}</th>)
    }

    render(){
        return(
            <>
                <table className="table">
                    <thead>
                        {this.renderTableHeaders(this.props.activityData)}
                    </thead>
                    <tbody>
                    <tr>
                        {this.renderTableContents(this.props.activityData)}
                    </tr>
                    </tbody>
                </table>
            </>
        );
    }
}