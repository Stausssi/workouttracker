import React, { Component } from "react";

interface Props {
    message: string
    type: string
}

export default class NotificationBox extends Component<Props> {
    render() {
        //renders an errorBox with the current state of the error message
        if(this.props.message === '') {
            return "";
        } else{
            return(
                <div className={`notification ${this.props.type}`}>{this.props.message}</div>
            );
        }
    }
}