import React from 'react'
import Chart from "chart.js";

interface Props {
    config?:{
        label:string[],
        datasets:{
            label:string
            fill:boolean
            data:string[]
        }[]
    }[]
}

interface State {
    active:boolean
    type:string
    newtype:string
    secondtype:string //use later to add second chart ==> https://www.chartjs.org/docs/latest/charts/mixed.html
    /*
    charts:{
        id,
        label,
        title,
        type,
        data
    }
    */
}


export default class Graphs extends React.Component<Props,State> {
    labels = ["Jan.","Feb.","Mar.","Apr.","May.","Jun.","Jul.","Aug.","Sep.","Oct.","Nov.","Dec."]
    chart1: Chart | undefined;
    chart2: Chart | undefined;
    charts: string[] = [];
    colors: string[] = [];
    data:number[] = [];
    constructor(props: Props) {
        super(props);
        this.state = {
            type:"line",
            newtype:"line",
            secondtype:"line",
            active:false
        };
    }
    
    action = () => {                                      //open and close modal
        this.setState((state) =>({active:!state.active}))
      };

testapi() {
    this.getdatasets()
    this.getcharts()
}

getcombinefetch() {
    var post:any;
// Call the API
fetch('http://localhost:9000/backend/charts/get').then(function (response) {
	if (response.ok) {
		return response.json();
	} else {
        return response.json().then((response) => {
            console.log("Failed to get charts: ", response);
        })
	}
}).then((data) => {
    post= JSON.parse(data.body)
    console.log(post)
	// Store the post data to a variable
    /* Check if user/sport are defined and */
    /* query over all charts */
	// Fetch another API
    console.log("sport: "+ post[1].param_sport + " user: " + post[1].param_user)
        var sport=post[1].param_sport
        var user=post[1].param_user
    const params = new URLSearchParams({ user: user,sport:sport })
    //Alternative: encodeURIComponent
	return fetch('http://localhost:9000/backend/charts/dataset?'+ params); //TODO: update route to filter ID/function  

}).then(function (response) {
	if (response.ok) {
		return response.json();
	} else {
		return Promise.reject(response);
	}
}).then(function (chartsData) {
	console.log(post, JSON.parse(chartsData.body));
}).catch(function (error) {
	console.warn(error);
});
}

getdatasets() {
    fetch("http://localhost:9000/backend/charts/test")
    .then(response => response.json())
    .then(data => console.log(JSON.parse(data.body)))
    .catch(error=>console.warn(error))
}

getcharts() {
    /* fetch charts, extract params from chart */
    fetch("http://localhost:9000/backend/charts/get")
    .then(response => response.json())
    .then((data) => console.log(JSON.parse(data.body)));
}

setcharts(data: any,name: string,type: string) {
    fetch("http://localhost:9000/backend/charts/add",{
        headers:{
          "accept":"application/json",
          "content-type":"application/json"
        },
        body: JSON.stringify(data),
        method:"POST"
      })
      .then(test=>{return test.json()}) //convert to json
      .then(res=>{console.log(res)})    //view response in console
      .then((data:any) => {
        console.log('Request succeeded');
        this.addElement(name,type)
    })
      .catch(error=>console.log(error)) //catch errors
      
    }

private drawSample() {
    //Destroy previous chart if exists before create a new chart
    if(typeof this.chart1 !== "undefined")
    {
        console.log("chart already exist");
        this.chart1.destroy();
    }
    console.log(this.state.type)
    //Create new Chart
    const canvas = document.getElementById('myChart') as HTMLCanvasElement
    this.chart1 = new Chart(canvas, {
        type: this.state.type,                                                  //Define chart type
        data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                label: "My First dataset",
               // type: "line",
                backgroundColor: "rgba(220,220,220,0.2)",
                borderColor: "rgba(220,220,220,1)",
                data: [65, 59, 4, 81, 56, 55, 40],
                fill:false
            }, {
                label: "My First dataset",
                //type: "bar",
                backgroundColor: "rgba(220,20,220,0.2)",
                borderColor: "rgba(220,20,220,1)",
                data: [32, 25, 33, 88, 12, 92, 33]
            }]
        },
    });
}
function() { 
  const title=document.getElementById('titleinput2') as HTMLInputElement
  const type=document.getElementById('typeinput') as HTMLInputElement
  if(title.value && type.value)
  {
    console.log(title.value)
    const chart = {
        name: title.value,
        type: type.value,
        dataset:"Default",//TODO: add wanted dataset to modal
        fill:true, //TODO: add option to modal
        param_sport:'Joggen',
        param_user:null
      } 
    this.action()
    this.setcharts(chart,chart.name,chart.type)
  }
  else {
    alert('Please give a name and a type for your chart!')
  }
}

addElement (title:string,type:string) {
    var chartnode = document.getElementById("chartID_"+title)
    if (!this.charts.includes(title)&& !chartnode)
    {
    this.charts.push()
    // erstelle ein neues div Element für jedes neues Chart
    //if(!document.getElementById("canvas"+title) --> check if element exists
    var canvas = document.createElement("canvas");
    canvas.id = "chartID_"+title;
    // füge das neu erstellte Element und seinen Inhalt ins DOM ein
    var parent = document.getElementById("charts");
    parent?.appendChild(canvas);
    console.log(document.getElementById(canvas.id))
    this.addcharts(canvas,type)
    alert("new canvas: "+canvas + " witch id " +canvas.id)
    }
    else {
        alert("Der ausgewählte Name existiert bereits. bitte wählen Sie in ein anderer Name aus!")
    }
}


removeElement (title:string) {
    /* When this function is call: check if chart on DB wa removed, then remove element on DOM and remove title as identifier from DB */
}

addcharts(canvas:HTMLCanvasElement,type:string) {
    var newchart= new Chart(canvas, {
        type: type,                                                  //Define chart type
        data: {
            labels: this.labels,
            datasets: [{
                label: "My First dataset",
                //new option, type will default to bar as that what is used to create the scale
               // type: "line",
                backgroundColor: "rgba(220,220,220,0.2)",
                borderColor: "rgba(220,220,220,1)",
                data: [65, 59, 4, 81, 56, 55, 40],
                fill:false
            }, {
                label: "My second dataset",
                //new option, type will default to bar as that what is used to create the scale
                //type: "bar",
                backgroundColor: "rgba(220,20,220,0.2)",
                borderColor: "rgba(220,20,220,1)",
                data: [32, 25, 33, 88, 12, 92, 33]
            }]
        },

    })
}

empty(list: any[]) {
    //empty array
    list.length = 0;
}

drawSample2() {
    const labels=["Januar","Februar","März","April","Mai","Juni"]
    this.empty(this.data);
    this.data.push(30, 90, 60, 80, 20, 70, 50)
   // this.data.push(""+30,""+ 90,""+ 60,""+ 80,""+ 20,""+ 70,""+ 50)
  /*  const colors =  [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(231,233,237)',
        'rgb(128,128,128)'
    ];*/
    const colors=this.getRandomColor(this.data);
    this.createchart(labels,this.data,colors)
}

getRandomColor(data: string | any[]) {
    for(let i=0;i<data.length;i++){
        this.colors.push('#'+Math.floor(Math.random()*16777215).toString(16));
  }
    return this.colors
}

createchart(labels: string[],data: number[],colors:string[]) {
    if(this.chart2)
    {
        console.log("chart already exist");
        this.chart2.destroy();
    }
    const canvas = document.getElementById('myChart2') as HTMLCanvasElement
    this.chart2 = new Chart(canvas, {
        type: this.state.type,
        data: {
            labels: labels,      //x axis labels
            datasets: [{                                                                 
                label: "Datensatz Nummer1",          
                data: data,
                type:"line",
                backgroundColor:colors,
                fill:false
            }]
        },
        options: {
            //responsive:true,                    //resize Chart to container size 
            //maintainAspectRatio:false,          //disable width/height ratio when chart is resized
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize:5,             //gap between scale ticks
                        maxTicksLimit: 5        //max amount of ticks           maxTick * stepSize = max data value
                    }
                }],
                xAxes: [{
                    ticks: {
                        beginAtZero: true,
                        stepSize:5,
                        maxTicksLimit: 5
                    }
                }]
            }
        }
    });
}

getrandomData() {
    const datasatz=Array.from({length: 20}, () => Math.floor(Math.random() * 100));
    console.log(datasatz);
    const string=[]
    for(var x=0;x<datasatz.length;x++)
    {
        var stringval=""+datasatz[x]
        string.push(stringval)

    }
    console.log(string)

}

updateChartType = (charttype:any) => {
    this.setState({ type: charttype.target.value });
    console.log(this.state.type)
  };

    render() {
        const active = this.state.active ? "is-active" : ""; 
        return (
<div className="container">
  <div className = "title">
    <h1>Chart 1</h1>
  </div>
  <div className="controls">
    <h5 className="label">Chart Type</h5>
    <select name="chartType" id="chartType" defaultValue={this.state.type} onChange={this.updateChartType}>
      <option value="line">Line</option>
      <option value="bar">Bar</option>
      <option value="horizontalBar">Horizontal Bar</option>
      <option value="radar">Radar</option>
      <option value="polarArea">Polar Area</option>
      <option value="doughnut">Doughnut</option>
      <option value="pie">Pie</option>
    </select>
    <button onClick={()=>this.getrandomData()}>Randomize Data!</button>
    <button onClick={()=>this.drawSample()}>Draw</button>
    <button onClick={()=>this.drawSample2()}>Draw with Config</button>
    <button onClick={()=>this.testapi()}>Test Api</button>
    <button onClick={()=>this.action()}>Open Modal</button>
    <button onClick={()=>this.getcombinefetch()}>get combine</button>
  </div>
  <div className="chart-container">
    <canvas id="myChart"></canvas>
  </div> 
  <div className="chart-container2">
    <canvas id="myChart2"></canvas>
  </div> 
  <div id="charts"/> 
  <div className={`modal ${active}`} id="ChartModal">
                    <div className="modal-background"></div>
                    <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Chart Modal</p>
                        <button className="delete" aria-label="close" onClick={()=>this.action()}></button>   
                    </header>
                    <section className = "modal-card-body">
                    <div className = "content">
                <h1>Chart Name</h1>
                <label className="label">Chart</label>
                <div className="control">
                  <input
                    className="input"
                    id="titleinput2"
                    type="text"
                    placeholder="e.g Neues Chart"
                  />
                    <input
                    className="input"
                    id="typeinput"
                    type="text"
                    placeholder="e.g line"
                  />
                  </div>
                  </div>
                    </section>
                    <footer className="modal-card-foot">
                        <button className="button is-success" onClick={()=>this.function()}>Save changes</button>
                        <button className="button" onClick={()=>this.action()} >Cancel</button>
                    </footer>
                    </div>
                </div>
</div>
        )
    }
}