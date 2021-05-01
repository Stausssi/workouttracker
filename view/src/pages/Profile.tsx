import React from 'react';
import Head from '../Head';
import Foot from '../Foot';
import ProfilePage from '../components/ProfilePage'

//Profile page

class Profile extends React.Component<any, any> {
    render() {
        return (
            <section className='main'>
                <Head/>
                <ProfilePage/>
                <Foot/>
            </section>
        )
    }
}

export default Profile

