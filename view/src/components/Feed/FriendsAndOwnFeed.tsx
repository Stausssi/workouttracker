import React from "react";


interface Props {
}

export class OwnFeed extends React.Component<Props> {
    render() {
        return (
            <>
                <div className="pr-4 pl-4 pt-1 pb-1">
                    <div>Hier kommt die eigene Aktivität hin</div>
                    <div>Weitere eigene Komponenten</div>

                    <Activity />
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

class Activity extends React.Component<any, any>{
    render() {
        return(
            <>
                <div className="card">
                    <div className="card-content">
                        <div className="media">
                            <div className="media-content has-text-left	">
                                <p className="title is-4">Niklas Drössler</p>
                                <p className="subtitle is-6">
                                    <time dateTime="2016-1-1">11:09 PM - 1 Jan 2016</time>
                                </p>
                            </div>
                            <div className="">
                                <button className="button is-success is-rounded">Like</button>
                            </div>
                        </div>

                        <div className="content ">
                            <div className="columns">

                                <div className="column is-one-fifth">
                                    <b className="title is-5">Sportart</b>
                                    <figure className="image is-48x48">
                                        <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image"/>
                                    </figure>
                                </div>
                                <div className="is-divider-vertical"/>

                                <div className="column">
                                    <table className="table">
                                        <thead>
                                            <th>Distanz</th>
                                            <th>Höhenmeter</th>
                                            <th>Höhenmeter</th>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>2km</td>
                                                <td>2000</td>
                                                <td>2000</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
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