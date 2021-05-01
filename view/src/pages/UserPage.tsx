import React, {useCallback} from 'react';
import Head from '../Head';
import Foot from '../Foot';
import Users from '../components/FollowUserSite'

class User extends React.Component<any, any> {
    private readonly commentRefreshInterval: any;
    constructor(props: any) {
        const { match: { params } } = props;
        super(props);
        this.state = {
            username: params.username,
            href: window.location.href,
        };
        this.commentRefreshInterval = setInterval(() => {  //set interval
            if(this.state.href != window.location.href){
                window.location.reload()
            }
        }, 1000);
    }

    render() {
        return (
            <section className='main'>
                <Head></Head>
                <Users username={this.state.username}></Users>
                <Foot></Foot>
            </section>
        )
    }
}

export default User

