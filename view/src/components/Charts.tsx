import React from "react";
import Chart from "chart.js/auto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import NotificationBox from "./notificationBox";
import DatePicker from "react-datepicker";
import en from "date-fns/locale/en-GB";
import "react-datepicker/dist/react-datepicker.css";
import SessionHandler from "../SessionHandler";
import { BACKEND_URL } from "../App";

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
  array: any;
  secondtype: string; //use later to add second chart ==> https://www.chartjs.org/docs/latest/charts/mixed.html
  charts: {};
  sports: string[];
  informtext: string;
  informtype: string;
  year: Date;
}

const colors = [
  "red",
  "blue",
  "orange",
  "coral",
  "green",
  "purple",
  "orange",
  "black",
  "pink",
  "gold",
  "silver",
  "navy",
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
  type: "line",
  category: "effort",
  sport: "",
  fill: false,
  array: "",
  secondtype: "", //use later to add second chart ==> https://www.chartjs.org/docs/latest/charts/mixed.html
  charts: {},
  sports: [],
  informtext: "",
  informtype: "",
  year: new Date(),
};

export default class Graphs extends React.Component<Props, State> {
  //chart1: Chart | undefined;
  chart2: Chart | undefined;
  //charts: string[] = [];
  //colors: string[] = [];
  //data: number[] = [];
  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }

  action = () => {
    //open and close modal
    let active = !this.state.active;
    if (active == true) {
      this.fetchsports();
      this.setState(() => ({ active: active }));
    } else {
      this.setState(initialState);
    }
  };

  componentDidMount() {
    this.getcharts();
  }

  fetchsports() {
    // Fetch sports, users and category from database
    fetch(BACKEND_URL + "sports/fetch", {
      method: "GET",
      headers: {
        Accept: "application/json",
        //Authorization: SessionHandler.getAuthToken()
      },
    }).then((response) => {
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

  getcharts() {
    // Call the API
    fetch(BACKEND_URL + "charts/get", {
      method: "GET",
      headers: {
        Accept: "application/json",
        //Authorization: SessionHandler.getAuthToken()
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((response) => {
            console.log("Failed to get charts: ", response);
          });
        }
      })
      .then((post) => {
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
      var year, sport, category;
      const params = new URLSearchParams();
      if (this.state.array[i].category) {
        category = this.state.array[i].category;
        params.append("category", category);
      }
      if (this.state.array[i].param_sport) {
        sport = this.state.array[i].param_sport;
        params.append("sport", sport);
      }
      if (this.state.array[i].year) {
        year = this.state.array[i].year;
        params.append("year", year);
        //console.log(year);
      }
      const url = BACKEND_URL + "charts/dataset?";
      const chart = {
        name: this.state.array[i].name,
        type: this.state.array[i].type,
        category: this.state.array[i].category,
        fill: this.state.array[i].fill,
        param_sport: this.state.array[i].sport, 
        year: this.state.array[i].year,
      };
      console.log(chart)
      //console.log(url + params);
      this.getdatasets(
        url,
        params,
        chart
      );
    }
  }

  test() {
    fetch(
      BACKEND_URL + "charts/dataset?category=effort&sport=Ballsport&year=2021"
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
    chart:any
  ) {
    fetch(url + params, {
      method: "GET",
      headers: {
        Accept: "application/json",
        //Authorization: SessionHandler.getAuthToken()
      },
    })
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
        this.addElement(chart, data); //=> add dataset
      })
      .catch((error) => console.warn(error));
  }

  addElement(chart:any, data: any) {
    var buttonnode = document.getElementById(chart.name);               //check if ID already exists (should be unique)
    var chartnode = document.getElementById("chart_ID" + chart.name);
    if (!chartnode && !buttonnode) {
      // create new div and new button for each new chart
      var canvas = document.createElement("canvas");
      canvas.id = "chartID_" + chart.name;
      canvas.className = chart.name;
      var button = document.createElement("button");
      button.id = chart.name;                         //Set button ID to chart title
      button.className = "button is-danger";
      button.innerHTML = "Delete " + canvas.id;
      button.onclick = (event: any) => this.removeChart(event.target.id);
      // add created elements to DOM
      var parent = document.getElementById("charts");
      parent?.appendChild(canvas);
      parent?.appendChild(button);
      this.addcharts(canvas, chart, data);
    } else {
      this.setState({
        informtext: "Element could not be added",
        informtype: "is-danger",
      });
    }
  }

  addcharts(
    canvas: HTMLCanvasElement,
    chart:any,
    data: any
  ) {
    let dataarray: any[] = new Array(labels.length);
    let subtitle = this.subtitle(chart.category,"",chart.year);
    dataarray.fill(0, 0, labels.length);
    for (let i = 0; i < data.length; i++) {
      labels.forEach((item, index) => {
        if (data[i].month === index && data[i].amount) {
          dataarray.splice(index - 1, 1, data[i].amount);
        }
      });
    }
    console.log(dataarray);
    new Chart(canvas, {
      options: {
          plugins: {
            title: {
              display: true,
              color:"#808080",
              text: [chart.name, subtitle],
              font: {
                size: 20,
              }
            },
          },
        },
      type: chart.type, //Define chart type
      data: {
        labels: labels,
        datasets: [
          {
            label: chart.name,
            backgroundColor: colors,
            data: dataarray,
            fill: chart.fill,
          },
          {
            label: "My second dataset",
            backgroundColor: "rgba(220,20,220,0.2)",
            borderColor: "rgba(220,20,220,1)",
            data: [],
          },
        ],
      },
    });
  }

  //Get inputs values then create charts
  configureChart() {
    if (
      this.state.title &&
      this.state.type &&
      this.state.year &&
      this.state.category
    ) {
      if (
        !this.state.array.find(
          (title: { name: string }) => title.name == this.state.title //check if title already exists
        )
      ) {
        var year = this.state.year.getFullYear();
        const chart = {
          name: this.state.title,
          type: this.state.type,
          category: this.state.category,
          fill: this.state.fill,
          param_sport: this.state.sport, //can be null
          year: year,
        };
        console.log(chart);
        const params = new URLSearchParams();
        params.append("category", chart.category);
        //params.append("sport", chart.param_sport);
        params.append("year", chart.year.toString());
        const url = BACKEND_URL + "charts/dataset?";
        console.log(url + params);
        this.getdatasets(url, params, chart);
        this.action();
        //this.setcharts(chart);
      } else {
        console.error(
          "Title was already given. Please choose an other title for your chart"
        );
      }
    } else {
      console.error("Configurtion values are missing");
    }
  }

  setcharts(chart: any) {
    fetch(BACKEND_URL + "charts/add", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        //Authorization: SessionHandler.getAuthToken()
      },
      body: JSON.stringify(chart),
    }).then((response) => {
      if (response.ok) {
      } else {
        console.log(response); //view response in console
      }
    });
  }

  addcharts(
    canvas: HTMLCanvasElement,
    title: string,
    type: string,
    data: any,
    fill: boolean
  ) {
    let dataarray: any[] = new Array(labels.length);
    let subtitle = "Hier etwas einfügen!";
    dataarray.fill(0, 0, labels.length);
    for (let i = 0; i < data.length; i++) {
      labels.forEach((item, index) => {
        if (data[i].month === index && data[i].amount) {
          dataarray.splice(index - 1, 1, data[i].amount);
        }
      });
    }
    console.log(dataarray);
    new Chart(canvas, {
      options: {
          plugins: {
            title: {
              display: true,
              color:"#808080",
              text: [title, "Subtitle"],
              font: {
                size: 20,
              }
            },
          },
        },
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
            data: [],
          },
        ],
      },
    });
  }

  //Get inputs values then create charts
  configureChart() {
    if (
      this.state.title &&
      this.state.type &&
      this.state.year &&
      this.state.category
    ) {
      if (
        !this.state.array.find(
          (title: { name: string }) => title.name == this.state.title //check if title already exists
        )
      ) {
        var year = this.state.year.getFullYear();
        const chart = {
          name: this.state.title,
          type: this.state.type,
          category: this.state.category,
          fill: this.state.fill,
          param_sport: this.state.sport, //can be null
          year: year,
        };
        console.log(chart);
        const params = new URLSearchParams();
        params.append("category", chart.category);
        //params.append("sport", chart.param_sport);
        params.append("year", chart.year.toString());
        const url = BACKEND_URL + "charts/dataset?";
        console.log(url + params);
        this.getdatasets(url, params, chart.name, chart.type, chart.fill);
        this.action();
        //this.setcharts(chart);
      } else {
        console.error(
          "Title was already given. Please choose an other title for your chart"
        );
      }
    } else {
      console.error("Configurtion values are missing");
    }
  }

  setcharts(chart: any) {
    fetch(BACKEND_URL + "charts/add", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        //Authorization: SessionHandler.getAuthToken()
      },
      body: JSON.stringify(chart),
    }).then((response) => {
      if (response.ok) {
      } else {
        console.log(response); //view response in console
      }
    });
  }

  removeChart(id: string) {
    var chart = null;
    const chartID = "chartID_" + id;
    chart = Chart.getChart(chartID);
    console.log(chart);
    console.log(chartID);
    if (chart) {
      chart.destroy();
      this.removeElement(id);
      fetch(BACKEND_URL + "charts/remove", {
        method: "DELETE",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          //Authorization: SessionHandler.getAuthToken()
        },
        body: JSON.stringify({ chartid: id }),
      }).then((response) => {
        if (response.ok) {
          console.log("Delete request has been submitted successfully");
        } else {
          console.log("Delete request has failed");
        }
      });
    }
  }

  removeElement(name: string) {
    console.log(name);
    console.log(document.getElementById("chartID_chart"));
    var canvas = document.getElementById(
      "chartID_" + name
    ) as HTMLCanvasElement;
    var button = document.getElementById(name) as HTMLButtonElement;
    if (canvas.parentNode && button.parentNode) {
      // parent ist div id=charts
      canvas.parentNode.removeChild(canvas);
      button.parentNode.removeChild(button);
      //const id = this.charts.indexOf(name);
      //this.charts.splice(id, 1);
      //console.log(this.charts);
    }
  }

  subtitle(category: string, ylab: string,year:number) {
    var subtitle = "";
    //bei getdatasets definieren
    if (categories.includes(category)) {
      subtitle = `${category} in ${ylab} per month for ${year}`;
    }
    return subtitle;
  }

  renderOptions(items: any[]) {
    return (
      items &&
      items.length > 0 &&
      items.map((item) => {
        return <option key={item}>{item}</option>;
      })
    );
  }

  handleDateOnChange(date: any) {
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

  renderOptions(items: any[]) {
    return (
      items &&
      items.length > 0 &&
      items.map((item) => {
        return <option key={item}>{item}</option>;
      })
    );
  }

  handleDateOnChange(date: any) {
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
    return (
      <div className="container">
        <div className="divider">Chart</div>
        <div className="controls">
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
                      selected={this.state.year}
                      locale={en}
                      onChange={(date: Date) => this.handleDateOnChange(date)}
                      minDate={new Date("01-01-1900")}
                      maxDate={new Date()}
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
                className={`button is-success`}
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
