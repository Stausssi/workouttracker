import React from "react";

export default class SuccessfulSignup extends React.Component<any, any> {
    render() {
        return (
            <section className="section">
                <div className="columns is-centered">
                    <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                        <br/><br/><br/>
                        <form className="box ">
                            <p>Your Registration is almost complete!</p>
                            <br/>
                            <p>We´ve send you an email to confirm your account!</p>
                            <br/>
                        </form>
                    </div>
                </div>
            </section>
        );
    }
}