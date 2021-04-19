import React, {Component} from "react";
import {BACKEND_URL, FRONTEND_URL} from "../../App";
import Header from './components/Header'
import Comments from './components/Comments'
import AddComment from './components/AddComment'

interface State {
  showAddComent: boolean;
  showthumpsUp: boolean; 
  thumpsUpCounter: number; 
  comments: any[];
}

export default class CommmentComponent extends Component<{}, State> {
  constructor(props: any) {
      super(props);

      this.state = {
        showAddComent: false,
        showthumpsUp: false,
        thumpsUpCounter: 0,
        comments: [],
      };

      this.refreshComment();
      this.isThumpUpSet();
      this.countThumps();

      setInterval(() => {  //set intervall
        this.refreshComment();
      }, 15000);

      setInterval(() => {
        this.countThumps();
      }, 30000);

      this.isThumpUpSet = this.isThumpUpSet.bind(this);
      this.countThumps = this.countThumps.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.addComment = this.addComment.bind(this);
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

  //Add comment
  addComment(comment: any){ 
    const id = Math.floor(Math.random() * 10000) + 1
    const newComment = { id, ...comment };
    console.log(newComment);
    const comments = this.state.comments;
    this.setState({comments: [...comments, newComment]});
  }

  //refresh comment
  refreshComment() {
    fetch("http://localhost:3001/backend/commendisnew/" + +12, {//get as default
        headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    }).then((response) => {
        if (response.status !== 200) {
            console.log('Looks like there was a problem. Status Code: ' +
              response.status);
            return;
          }
          // Examine the text in the response
          response.json().then((data) => {
            //console.log(data.Rowdata);
            this.setState({comments: data.Rowdata});
          });
    });
  }

  newThumpsState() {
    fetch(BACKEND_URL + '/thumpsup', {
      method: 'POST',
      headers:{
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          activity: 12,
          user: 12,
      }),
    });
    var tmpthumpsUpCounter;
    if(this.state.showthumpsUp) tmpthumpsUpCounter = this.state.thumpsUpCounter - 1;
    else tmpthumpsUpCounter = this.state.thumpsUpCounter + 1;
    this.setState({thumpsUpCounter: tmpthumpsUpCounter});
  }

  

  //Count Thumps
  countThumps() {
    fetch(BACKEND_URL + "/countThumps/" + +12, {//get as default
        headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    }).then((response) => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      // Examine the text in the response
      response.json().then((data) => {
        this.setState({thumpsUpCounter: data[0].counter});
      });
    });
  }


  //Count Thumps
  async isThumpUpSet() {
    fetch(BACKEND_URL + '/isthumpsupset', {
      method: 'POST',
      headers:{
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          activity: 12,
          user: 12,
      }),
    }).then((response) => {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      // Examine the text in the response
      response.json().then((data) => {
        this.setState({showthumpsUp: data});
      });
    });
  }

  thumpIsPresed() {
    this.setState({showthumpsUp: !this.state.showthumpsUp});
    this.newThumpsState();
  }

  render(){
    return (
      <div className="container">
        <Header thumpsUpCounter={this.state.thumpsUpCounter} thumpsUp={() => this.thumpIsPresed()} showthumpsUp={this.state.showthumpsUp} onAdd={() => this.setState({showAddComent: !this.state.showAddComent})} />
        {this.state.showAddComent && <AddComment onAdd={this.addComment} />}
        {this.state.comments.length > 0 ?(
          <Comments comments={this.state.comments}/>
        ) : (
          'No Comments To Show'
        )}
      </div>
    );
  }
}

