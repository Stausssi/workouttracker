import React from 'react';
import Head from '../Head';
import Foot from '../Foot';
import Users from '../components/FollowUserSite'

class User extends React.Component<any, any> {
    private readonly pageRefreshInterval: any;

    constructor(props: any) {
        const {match: {params}} = props;
        super(props);
        this.state = {
            username: params.username,
            href: window.location.href,
        };

        this.pageRefreshInterval = setInterval(() => {  //set interval
            if (this.state.href !== window.location.href) {
                window.location.reload()
            }
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.pageRefreshInterval);
    }

    render() {
        return (
            <section className='main'>
                <Head/>
                <Users username={this.state.username}/>
                <Foot/>
            </section>
        )
    }
}

export default User

