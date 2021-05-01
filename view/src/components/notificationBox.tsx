import React, {Component} from "react";
import parse from 'html-react-parser';

interface Props {
    message: string
    type: string
    hasDelete: boolean
}

interface State {}

// TODO: Add delete button functionality
export default class NotificationBox extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {}
    }

    render() {
        // Displays a notification to inform the user of something
        if (this.props.message.length === 0) {
            return "";
        } else {
            return (
                <div className={`notification ${this.props.type}`}>
                    {(this.props.hasDelete ? <button type="button" className="delete" /> : "")}
                    {parse(this.props.message)}
                </div>
            );
        }
    }
}