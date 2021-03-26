import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
interface State {
  showPopup:boolean
  active:boolean
}

export default class Modal extends React.Component<Props,State> {
    constructor(props: Props) {
        super(props);
        this.state = {
          showPopup: false,
          active: false
        };
      }

/*      open() {
        var modal = document.getElementById("myModal");
        var html = document.querySelector('html');
        if (modal && html)
        {
            modal.classList.add('is-active');
            html.classList.add('is-clipped');
        }
        else {
        console.log("Fehler")
        }
        }
    close () {
        var modal = document.getElementById("myModal");
        var html = document.querySelector('html');
        if (modal && html)
        {
        modal.classList.remove('is-active');
        html.classList.remove('is-clipped');
        }
    }*/
        test = () => {
            /*this.setState({ active: !this.state.active });*/
            this.setState((state) =>({active:!state.active}))
            console.log("Kinder sind:" + this.props.children)
          };
        
    

  render () {  
    const active = this.state.active ? "is-active" : "";
    const children =this.props.children
    return(
        <section className='main'>
         <div className={`modal ${active}`} id="myModal">
            <div className="modal-background"></div>
                <div className="modal-card">
                <header className="modal-card-head">
                    <p className="modal-card-title">Modal title</p>
                    <button className="delete" aria-label="close" onClick={()=>this.test()}></button>
                </header>
                <section className = "modal-card-body">
                    <div className = "content">
                        <h1>Level One</h1>
                        <p>
                        This is simple text. This is simple text. 
                        This is simple text. This is simple text.
                        </p>
                
                        <h2>Level Two</h2>
                         <p>
                         This is simple text. This is simple text. 
                        This is simple text. This is simple text.
                        </p>
                
                        <h3>Level Three</h3>
                        <blockquote>
                        This is simple text. This is simple text. 
                        This is simple text. This is simple text.
                        </blockquote>
                
                        <h4>Level Four</h4>
                        <p>
                        This is simple text. This is simple text. 
                        This is simple text. This is simple text.
                        </p>
                
                        <h5>Level Five</h5>
                        <p>
                        This is simple text. This is simple text. 
                        This is simple text. This is simple text.
                        </p>
                <h1>Test</h1>
                <label className="label">Name</label>
                <div className="control">
                  <input
                    className="input"
                    type="text"
                    placeholder="e.g Alex Smith"
                  />
                </div>
                <h1>Test2</h1>
                <p>{this.props.children}</p>
                <div>
    Song List
    {(children: any[])=>{
      children.map((item, i) => {
       return(`Song ${i} - ${item}`);
    })}}
</div>
                <h1>Level One</h1>
                        <p>
                        This is simple text. This is simple text. 
                        This is simple text. This is simple text.
                        </p>
                
                        <h2>Level Two</h2>
                         <p>
                         This is simple text. This is simple text. 
                        This is simple text. This is simple text.
                        </p>
                
                        <h3>Level Three</h3>
                        <blockquote>
                        This is simple text. This is simple text. 
                        This is simple text. This is simple text.
                        </blockquote>
                
                        <h4>Level Four</h4>
                        <p>
                        This is simple text. This is simple text. 
                        This is simple text. This is simple text.
                        </p>
                
                        <h5>Level Five</h5>
                        <p>
                        This is simple text. This is simple text. 
                        This is simple text. This is simple text.
                        </p>
             </div>
          </section>
        <footer className="modal-card-foot">
            <button className="button is-success">Save changes</button>
            <button className="button" onClick={this.test} >Cancel</button>
        </footer>
    </div>
    </div>

<button className="button is-primary is-rounded" onClick={()=>this.test()}>
<span className="icon">
    <FontAwesomeIcon icon ={faPlusCircle}/>
    </span>
              </button>
</section>
    );
  }
}
  
  

