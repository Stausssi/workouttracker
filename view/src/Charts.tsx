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
    type:string
    secondtype:string //use later to add second chart ==> https://www.chartjs.org/docs/latest/charts/mixed.html
}

export default class Graphs extends React.Component<Props,State> {
    chart1: Chart | undefined;
    chart2: Chart | undefined;
    colors: string[] = [];
    data:number[] = [];
    constructor(props: Props) {
        super(props);
        this.state = {
          type:"line",
          secondtype:"line"
        };
      }

   /*   componentDidMount() {
        fetch(title_URL)
            .then(response => {
                return response.json();
            })
            .then(data => {
                // Here you need to use an temporary array to store NeededInfo only 
                let tmpArray = []
                for (var i = 0; i < data.results.length; i++) {
                    tmpArray.push(data.results[i].NeededInfo)
                }
    
                this.setState({
                    other: tmpArray
                })
            });
    }*/

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
                //new option, type will default to bar as that what is used to create the scale
               // type: "line",
                backgroundColor: "rgba(220,220,220,0.2)",
                borderColor: "rgba(220,220,220,1)",
                data: [65, 59, 4, 81, 56, 55, 40],
                fill:false
            }, {
                label: "My First dataset",
                //new option, type will default to bar as that what is used to create the scale
                //type: "bar",
                backgroundColor: "rgba(220,20,220,0.2)",
                borderColor: "rgba(220,20,220,1)",
                data: [32, 25, 33, 88, 12, 92, 33]
            }]
        },
    });
}
function() { 
    //var ctx_$title = document.getElementById('canvas_$title').getContext('2d');                                    
    //window.myBar = new Chart(ctx_$title).Bar(barChartData_$title, { responsive : true }); 
}

addElement () {
    // erstelle ein neues div Element
    // und gib ihm etwas Inhalt
    var newDiv = document.createElement("div");
    var newContent = document.createTextNode("Hi there and greetings!");
    newDiv.appendChild(newContent); // füge den Textknoten zum neu erstellten div hinzu.
  
    // füge das neu erstellte Element und seinen Inhalt ins DOM ein
    var currentDiv = document.getElementById("div1");
    document.body.insertBefore(newDiv, currentDiv);

    /*
    var canvas = document.createElement("canvas");
canvas.id = "my-id";
specContainerNode.appendChild(canvas);*/
  }

empty(list: any[]) {
    //empty your array
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
                backgroundColor:colors,
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
  </div>
  <div className="chart-container">
    <canvas id="myChart"></canvas>
  </div> 
  <div className="chart-container2">
    <canvas id="myChart2"></canvas>
  </div>   
</div>
        )
    }
}