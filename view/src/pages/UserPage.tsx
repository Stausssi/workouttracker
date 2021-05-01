import React from 'react';
import Head from '../Head';
import Foot from '../Foot';
import Users from '../components/FollowUserSite'

class User extends React.Component<any, any> {
    render() {
        return (
            <section className='main'>
                <Head/>
                <Users username={this.props.match.params.username}/>
                <Foot/>
            </section>
        )
    }
}

export default User

