import React from 'react';
import Head from '../Head';
import Foot from '../Foot';
import Profile from '../components/ProfileSite'

//Profile page

class Profil extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            value: 0,
            text: '',
        };
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

