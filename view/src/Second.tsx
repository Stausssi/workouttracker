import React from 'react';
import Head from './Head';
import Foot from './Foot';

class Second extends React.Component<any, any> {
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
                <Head></Head>
                <Foot></Foot>
            </section>
        )
    }
}

export default Second
