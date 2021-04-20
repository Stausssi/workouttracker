import React from "react";
import Chart from "chart.js/auto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import NotificationBox from "./notificationBox";
import DatePicker from "react-datepicker";
import en from "date-fns/locale/en-GB";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  config?: {
    label: string[];
    datasets: {
      label: string;
      fill: boolean;
      data: string[];
    }[];
  }[];
}

interface State {
  active: boolean;
  title: string;
  type: string;
  category: string;
  sport: string;
  fill: boolean;
  submit: boolean;
  newtype: string;
  array: any;
  secondtype: string; //use later to add second chart ==> https://www.chartjs.org/docs/latest/charts/mixed.html
  chartsarray: {};
  sports: string[];
  informtext: string;
  informtype: string;
  year: Date;
}

const colors = [
  "red",
  "blue",
  "yellow",
  "gray",
  "green",
  "purple",
  "orange",
  "black",
  "pink",
  "gold",
  "silver",
  "bronze",
];

const labels = [
  "Jan.",
  "Feb.",
  "Mar.",
  "Apr.",
  "May.",
  "Jun.",
  "Jul.",
  "Aug.",
  "Sep.",
  "Oct.",
  "Nov.",
  "Dec.",
];

const types = [
  "line",
  "bar",
  "horizontalBar",
  "radar",
  "polarArea",
  "doughnut",
  "pie",
];

const categories = [
  "effort",
  "distance",
  "duration",
  "pace",
  "averageHeartRate",
  "altitudeDifference",
];

const initialState = {
  active: false,
  title: "",
  type: "",
  category: "",
  sport: "",
  fill: false,
  submit: false,
  newtype: "",
  array: "",
  secondtype: "", //use later to add second chart ==> https://www.chartjs.org/docs/latest/charts/mixed.html
  chartsarray: {},
  sports: [],
  informtext: "",
  informtype: "",
  year: new Date(),
};

export default class Graphs extends React.Component<Props, State> {
  chart1: Chart | undefined;
  chart2: Chart | undefined;
  charts: string[] = [];
  colors: string[] = [];
  data: number[] = [];
  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }

  action = () => {
    //open and close modal
    this.setState((state) => ({ active: !state.active }));
    //let active = !this.state.active;
    //this.setState({ active: active });
  };

  allow() {
    let submit = !this.state.submit;
    this.setState({ submit: submit });
  }

  componentDidMount() {
    this.fetchsports();
  }

  fetchsports() {
    // Fetch sports, users and category from database
    fetch("http://localhost:9000/backend/sports/fetch").then((response) => {
      if (response.ok) {
        return response.json().then((response) => {
          let data = JSON.parse(response.body);
          let sports = [];
          sports.push("");
          for (let key in data) {
            sports.push(key);
          }
          this.setState({ sports: sports });
        });
      } else {
        return response.json().then((response) => {
          console.log("Sport Fetch failed:", response);
          this.setState({ sports: [] });
        });
      }
    });
  }

  createSportSelect() {
    let sports = [];
    sports.push(<option value="0" key="0" />);

    for (let key in this.state.sports) {
      sports.push(
        <option value={key} key={key}>
          {key}
        </option>
      );
    }

    return sports;
  }

  getcharts() {
    //setstate charts then make new fetch to get data for each charts
    // Call the API
    fetch("http://localhost:9000/backend/charts/get")
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((response) => {
            console.log("Failed to get charts: ", response);
          });
        }
      })
      .then((post) => {
        console.log(post);
        console.log(JSON.parse(post.body));
        this.setState({ array: JSON.parse(post.body) });
        this.loopOverData();
      })
      .catch((error) => console.warn(error));
  }

  loopOverData() {
    for (let i = 0; i < this.state.array.length; i++) {
      // Store the post data to a variable
      /* Check if user/sport are defined and query over all charts */
      //query parameter values from DB and set if not NULL. else, let values as undefined
      var user, sport, category;
      let queries: any[] = [];
      const params = new URLSearchParams();
      if (this.state.array[i].category) {
        category = this.state.array[i].category;
        queries.push(category);
        params.append("category", category);
      }
      if (this.state.array[i].param_sport) {
        sport = this.state.array[i].param_sport;
        queries.push(sport);
        params.append("sport", sport);
      }
      if (this.state.array[i].param_user) {
        user = this.state.array[i].param_user;
        queries.push(user);
        params.append("user", user);
      }
      const url = "http://localhost:9000/backend/charts/dataset?";
      console.log(url + params);
      //this.addElement(this.state.array[i].name, this.state.array[i].type);
      this.getdatasets(
        url,
        params,
        this.state.array[i].name,
        this.state.array[i].type,
        this.state.array[i].fill
      );
    }
  }

  test() {
    console.log(this.state.fill);
    fetch(
      "http://localhost:9000/backend/charts/dataset?category=duration&sport=Ballsport&user=true"
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject(response);
        }
      })
      .then((chartsData) => {
        var data = JSON.parse(chartsData.body);
        console.log(data);
      })
      .catch((error) => console.warn(error));
  }

  getdatasets(
    url: string,
    params: any,
    name: string,
    type: string,
    fill: boolean
  ) {
    fetch(url + params)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject(response);
        }
      })
      .then((chartsData) => {
        var data = JSON.parse(chartsData.body);
        console.log(data);
        this.addElement(name, type, data, fill); //=> add dataset
      })
      .catch((error) => console.warn(error));
  }

  setcharts(data: any, name: string, type: string, fill: boolean) {
    fetch("http://localhost:9000/backend/charts/add", {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
      method: "POST",
    })
      .then((test) => {
        return test.json();
      }) //convert to json
      .then((res) => {
        console.log(res);
      }) //view response in console
      .then((data: any) => {
        console.log("Request succeeded");
        this.addElement(name, type, data, fill);
      })
      .catch((error) => console.log(error)); //catch errors
  }

  //Get inputs values then create charts
  configureChart() {
    const chart = {
      name: this.state.title,
      //subtitle: Metrik, ifo about what chart is showing
      type: this.state.type,
      category: this.state.category, //"Default"
      fill: this.state.fill, //TODO: add option to modal
      param_sport: this.state.sport, //:null,
      //year
    };
    this.action();
    this.setcharts(chart, chart.name, chart.type, chart.fill);
  }

  addElement(title: string, type: string, data: any, fill: boolean) {
    var chartnode = document.getElementById("chartID_" + title);
    if (!this.charts.includes(title) && !chartnode) {
      this.charts.push();
      // erstelle ein neues div Element für jedes neues Chart
      //if(!document.getElementById("canvas"+title) --> check if element exists
      var canvas = document.createElement("canvas");
      canvas.id = "chartID_" + title;
      // füge das neu erstellte Element und seinen Inhalt ins DOM ein
      var parent = document.getElementById("charts");
      parent?.appendChild(canvas);
      console.log(document.getElementById(canvas.id));
      this.addcharts(canvas, type, data, fill);
    } else {
    }
  }

  removeElement(title: string) {
    var chartnode = document.getElementById(
      "chartID_" + title
    ) as HTMLCanvasElement;
    if (chartnode.parentNode) {
      chartnode.parentNode.removeChild(chartnode);
    }
  }

  addcharts(canvas: HTMLCanvasElement, type: string, data: any, fill: boolean) {
    let dataarray: any[] = new Array(labels.length);
    dataarray.fill(0, 0, labels.length);
    for (let i = 0; i < data.length; i++) {
      labels.forEach((item, index) => {
        if (data[i].month === index) {
          console.log("Platz:" + (index - 1));
          dataarray.splice(index - 1, 1, data[i].amount);
        }
      });
    }
    console.log(dataarray);
    new Chart(canvas, {
      type: type, //Define chart type
      data: {
        labels: labels,
        datasets: [
          {
            label: "My First dataset",
            //new option, type will default to bar as that what is used to create the scale
            // type: "line",
            backgroundColor: colors,
            data: dataarray,
            fill: fill,
          },
          {
            label: "My second dataset",
            //new option, type will default to bar as that what is used to create the scale
            //type: "bar",
            backgroundColor: "rgba(220,20,220,0.2)",
            borderColor: "rgba(220,20,220,1)",
            data: [32, 2500000, 3300000, 88000, 12, 920000, 33],
          },
        ],
      },
    });
  }

  /*##############################################################*/
  /*OLD, Delete before merge*/
  private drawSample() {
    //Destroy previous chart if exists before create a new chart
    if (typeof this.chart1 !== "undefined") {
      console.log("chart already exist");
      this.chart1.destroy();
    }
    console.log(this.state.type);
    //Create new Chart
    const canvas = document.getElementById("myChart") as HTMLCanvasElement;
    this.chart1 = new Chart(canvas, {
      type: this.state.type, //Define chart type
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
        ],
        datasets: [
          {
            label: "My First dataset",
            // type: "line",
            backgroundColor: "rgba(220,220,220,0.2)",
            borderColor: "rgba(220,220,220,1)",
            data: [65, 59, 4, 81, 56, 55, 40],
            fill: false,
          },
          {
            label: "My First dataset",
            //type: "bar",
            backgroundColor: "rgba(220,20,220,0.2)",
            borderColor: "rgba(220,20,220,1)",
            data: [32, 25, 33, 88, 12, 92, 33],
          },
        ],
      },
    });
  }

  createchart(/*labels: string[],*/ data: number[] /* color: string[]*/) {
    if (this.chart2) {
      console.log("chart already exist");
      this.chart2.destroy();
    }
    const canvas = document.getElementById("myChart2") as HTMLCanvasElement;
    this.chart2 = new Chart(canvas, {
      type: this.state.type,
      data: {
        labels: labels, //x axis labels
        datasets: [
          {
            label: "Datensatz Nummer1",
            data: data,
            type: "line",
            backgroundColor: colors,
            fill: false,
          },
        ],
      },
      options: {
        //responsive:true,                    //resize Chart to container size
        //maintainAspectRatio:false,          //disable width/height ratio when chart is resized
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: 5, //gap between scale ticks
                maxTicksLimit: 5, //max amount of ticks           maxTick * stepSize = max data value
                scaleLabel: {
                  display: true,
                  labelString: "value",
                },
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: 5,
                maxTicksLimit: 5,
                scaleLabel: {
                  display: true,
                  labelString: "Month",
                },
              },
            },
          ],
        },
      },
    });
  }

  /* END of TODELETE */
  /*##############################################################*/

  renderOptions(items: any[]) {
    return (
      items &&
      items.length > 0 &&
      items.map((item) => {
        return <option key={item}>{item}</option>;
      })
    );
  }

  handleDateOnChange(date: Date) {
    this.setState({ year: date });
  }

  handleOnChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    console.log(event.target.value);
    console.log(event.target.name);
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState(({
      [name]: value,
    } as unknown) as Pick<State, keyof State>);
  }

  handleOnCheck(event: any) {
    const target = event.target;
    const name = target.name;
    var check = target.checked;
    console.log(check);
    console.log(target);
    console.log(name);
    console.log(check);
    this.setState(({
      [name]: check,
    } as unknown) as Pick<State, keyof State>);
  }

  render() {
    const active = this.state.active ? "is-active" : "";
    const submit = this.state.submit ? "" : "is-disabled";
    return (
      <div className="container">
        <div className="divider">Chart</div>
        <div className="controls">
          <button className="button" onClick={() => this.drawSample()}>
            Draw
          </button>
          <button className="button" onClick={() => this.action()}>
            Open Modal
          </button>
          <button className="button" onClick={() => this.getcharts()}>
            get combine
          </button>
          <button className="button" onClick={() => this.test()}>
            Test Api
          </button>
        </div>
        <div id="charts" />
        <div className="chart-container">
          <canvas id="myChart"></canvas>
        </div>
        <div className="chart-container2">
          <canvas id="myChart2"></canvas>
        </div>
        <div className={`modal ${active}`} id="ChartModal">
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Chart Modal</p>
              <button
                className="delete"
                aria-label="close"
                onClick={() => this.action()}
              ></button>
            </header>
            <section className="modal-card-body">
              <div className="content">
                <div className="control">
                  <label className="label">Chart Name</label>
                  <input
                    className="input"
                    id="charttitle"
                    name="title"
                    type="text"
                    placeholder="Chart title"
                    value={this.state.title}
                    onChange={(title) => this.handleOnChange(title)}
                  />
                  <label className="label">Chart Type</label>
                  <div className="select is-fullwidth mb-5">
                    <select
                      className="type"
                      name="type"
                      id="type"
                      onChange={(type) => this.handleOnChange(type)}
                    >
                      {this.renderOptions(types)}
                    </select>
                  </div>
                  <label className="label">Filter for category</label>
                  <div className="select is-fullwidth">
                    <select
                      className="select is-fullwidth mb-5"
                      name="category"
                      id="category"
                      onChange={(category) => this.handleOnChange(category)}
                    >
                      {this.renderOptions(categories)}
                    </select>
                  </div>
                  <div className="is-divider" data-content="Optional"></div>
                  <label className="label">Filter for sport</label>
                  <div className="select is-fullwidth mb-5">
                    <select
                      className="sport"
                      name="sport"
                      id="sport"
                      onChange={(sport) => this.handleOnChange(sport)}
                    >
                      {this.renderOptions(this.state.sports)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Select year</label>
                    <DatePicker
                      dateFormat="yyyy"
                      showYearPicker
                      locale={en}
                      onChange={(date: Date) => this.handleDateOnChange(date)
                      }
                      inline
                    />
                  </div>
                  <div>
                    <label className="label">
                      <input
                        type="checkbox"
                        name="fill"
                        checked={this.state.fill}
                        onChange={(fill) => this.handleOnCheck(fill)}
                      />
                      Fill Graph
                    </label>
                  </div>
                </div>
              </div>
            </section>
            <footer className="modal-card-foot">
              <button
                className={`button is-success  ${submit}`}
                onClick={() => this.configureChart()}
              >
                <FontAwesomeIcon icon={faCheck} />
                <span className="m-2">Save</span>
              </button>
              <button
                className="button is-danger"
                onClick={() => this.action()}
              >
                <FontAwesomeIcon icon={faTimes} />
                <span className="m-2">Cancel</span>
              </button>
            </footer>
            <NotificationBox
              message={this.state.informtext}
              type={this.state.informtype}
              hasDelete={false}
            />
          </div>
        </div>
      </div>
    );
  }
}
