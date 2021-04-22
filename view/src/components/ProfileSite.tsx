import React, {Component} from "react";
import {BACKEND_URL, FRONTEND_URL} from "../App";
import SessionHandler from "../utilities/SessionHandler";

interface State {
    username: string,
    firstname: string,
    lastname: string,
    email: string,
    age: number | string,
    weight: number | string,

    firstnamePlaceholder: string;
    lastnamePlaceholder: string;
    agePlaceholder: string;
    weightPlaceholder: string;
    emailPlaceholder: string;
}

export default class ProfileSiteProfileSite  extends Component<{}, State> {
    constructor(props: any) {
        super(props);
        var username = "undefined Username";
        if(SessionHandler.getUser()) {
            // @ts-ignore
            username = SessionHandler.getUser().username.toString();
        }

        this.state = {
              username: username,
              firstname: '',
              lastname: '',
              age: '',      //it is now date
              weight: '',
              email: '',

              firstnamePlaceholder: 'Add your firstname',
              lastnamePlaceholder: 'Add your lastname',
              agePlaceholder: 'Add your age',
              weightPlaceholder: 'Add your weight',
              emailPlaceholder: 'Add your email',
        };

        this.getDefaultValues();

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getDefaultValues() {
      fetch(BACKEND_URL + "profilesite/" + this.state.username, {//get as default
            headers:{
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: SessionHandler.getAuthToken() 
            },
      }).then((response) => {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        // Examine the text in the response
        response.json().then((data) => {
            if(data[0].firstname) this.setState({firstnamePlaceholder: data[0].firstname});
            if(data[0].lastname) this.setState({lastnamePlaceholder: data[0].lastname});
            if(data[0].age) this.setState({agePlaceholder: data[0].age});
            if(data[0].weight) this.setState({weightPlaceholder: data[0].weight});
            if(data[0].email) this.setState({emailPlaceholder: data[0].email});
        });
      });
   }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        // makes all input attributes "controlled components"
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        } as unknown as Pick<State, keyof State>);
    }
    
    handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        //coolen PUT REQUEST machen der die Daten auf das Backend schiebt und sie dort dann überprüfen
        fetch(BACKEND_URL + 'profilesiteupdate', {
            method: 'PUT',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: SessionHandler.getAuthToken() 
            },
            body: JSON.stringify({
                firstname: this.state.firstname,
                lastname: this.state.lastname,
                age: this.state.age,
                weight: this.state.weight,
                email: this.state.email,
            }),
        });
        if(this.state.firstname){
            this.setState({firstnamePlaceholder: this.state.firstname});
            this.setState({firstname: ''});

        } 
        if(this.state.lastname){
            this.setState({lastnamePlaceholder: this.state.lastname});
            this.setState({lastname: ''});

        } 
        if(this.state.age){
            this.setState({agePlaceholder: this.state.age.toString()});
            this.setState({age: 1});
        } 
        if(this.state.weight){
            this.setState({weightPlaceholder: this.state.weight.toString()});
            this.setState({weight: 1});
        } 
        if(this.state.email){
            this.setState({emailPlaceholder: this.state.email});
            this.setState({email: ''});

        } 
    }

   
    render(){
        return (
            <div className="section">
                <div className="container">
                    <form className='box'>
                        <p className="is-size-4">Hello {this.state.username},<br/> here you can change your account values</p>
                        <div className='field'>
                            <label className="label">Firstname</label>
                            <input className="input" name='firstname' type='text' maxLength={30} placeholder={this.state.firstnamePlaceholder} value={this.state.firstname} onChange={this.handleChange} />
                        </div>
                        <div className='field'>
                            <label className="label">Lastname</label>
                            <input className="input" name='lastname' type='text' maxLength={30} placeholder={this.state.lastnamePlaceholder} value={this.state.lastname} onChange={this.handleChange} />
                        </div>
                        <div className='field'>
                            <label className="label">age</label>
                            <input className="input" name='age' type='number' min="0" max="140" placeholder={this.state.agePlaceholder} value={this.state.age} onChange={this.handleChange} />
                        </div>
                        <div className='field'>
                            <label className="label">Weight</label>
                            <input className="input" name='weight' type='number' min="0" max="300" placeholder={this.state.weightPlaceholder} value={this.state.weight} onChange={this.handleChange} />
                        </div>
                        <div className='field'>
                            <label className="label">e-mail</label>
                            <input className="input" name='email' type='email' maxLength={50} placeholder={this.state.emailPlaceholder} value={this.state.email} onChange={this.handleChange} />
                        </div>
                        <button type='submit' className='input is-black is-outlined' onClick={this.handleSubmit}>Change Data</button>
                    </form>
                </div>
            </div>
        )
    }
}
