import React from 'react';
import Head from '../Head';
import Foot from '../Foot';
import Profile from '../components/ProfilePage'

//Profile page

class Profil extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <section className='main'>
                <Head/>
                <Profile/>
                <Foot/>
            </section>
        )
    }
}

export default Profil

