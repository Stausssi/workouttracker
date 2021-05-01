import React from 'react';
import Head from '../Head';
import Foot from '../Foot';
import Profile from '../components/ProfilePage'

class Profil extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }
    render() {
        return (
            <section className='main'>
                <Head></Head>
                <Profile></Profile>
                <Foot></Foot>
            </section>
        )
    }
}

export default Profil

