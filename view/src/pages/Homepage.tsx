import React from 'react';
import Head from '../Head';
import Body from '../Body';
import Foot from '../Foot';

class Homepage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <section className='main'>
                <Head />
                <Body />
                <Foot />
            </section>
        )
    }
}

export default Homepage

