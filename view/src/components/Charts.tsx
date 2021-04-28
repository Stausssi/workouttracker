import React from "react";
import Chart from "chart.js/auto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import NotificationBox from "./NotificationBox";
import DatePicker from "react-datepicker";
import en from "date-fns/locale/en-GB";
import "react-datepicker/dist/react-datepicker.css";
import SessionHandler from "../SessionHandler";
import { BACKEND_URL } from "../App";
import "bulma-extensions/bulma-switch/dist/css/bulma-switch.min.css";

interface Props {}

interface State {
  active: boolean;
  title: string;
  type: string;
  category: string;
  sport: string;
  year: Date;
  fill: boolean;
  array: any;
  sports: string[];
  switchfunc: boolean;
  informtext: string;
  informtype: string;
}

const colors = [
  "silver",
  "gold",
  "red",
  "blue",
  "orange",
  "coral",
  "green",
  "purple",
  "orange",
  "black",
  "pink",
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

const categories = ["distance", "duration", "effort", "altitudeDifferences"];

const averagecategories = ["averageHeartRate", "pace"];

const initialState = {
  active: false,
  title: "",
  type: "line",
  category: "effort",
  sport: "",
  fill: false,
  array: "",
  sports: [],
  switchfunc: false,
  informtext: "",
  informtype: "",
  year: new Date(),
};

export default class Graphs extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = initialState; //init state
  }

  action = () => {
    //open and close modal
    let active = !this.state.active;
    if (active === true) {
      this.fetchsports(); //fetch sports from DB when modal opens
      this.setState(() => ({ active: active }));
    } else {
      this.setState(initialState); //reset state on close
    }
  };

  componentDidMount() {
    this.getcharts(); //get charts with data on mount
  }

  fetchsports() {
    // Fetch sports, users and category from database
    fetch(BACKEND_URL + "sports/fetch", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: SessionHandler.getAuthToken(),
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
    //get charts
    // Call the API
    fetch(BACKEND_URL + "charts/get", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: SessionHandler.getAuthToken(),
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((response) => {
            console.log("Failed to get charts: ", response); //error message in console on error
          });
        }
      })
      .then((data) => {
        console.log(JSON.parse(data.body));
        this.setState({ array: JSON.parse(data.body) }); //add charts to array
        this.loopOverData(); //get data for each chart
      })
      .catch((error) => console.warn(error));
  }

  loopOverData() {
    for (let i = 0; i < this.state.array.length; i++) {
      //loop over each chart
      var year, sport, category, sqlfunc;
      const params = new URLSearchParams(); //create query params for request
      if (this.state.array[i].category) {
        category = this.state.array[i].category;
        params.append("category", category);
      }
      if (this.state.array[i].sqlfunc) {
        sqlfunc = this.state.array[i].sqlfunc;
        params.append("sqlfunc", sqlfunc);
      }
      if (this.state.array[i].param_sport) {
        sport = this.state.array[i].param_sport;
        params.append("sport", sport);
      }
      if (this.state.array[i].year) {
        year = this.state.array[i].year;
        params.append("year", year);
      }
      const url = BACKEND_URL + "charts/dataset?";
      const chart = {
        //build chart constructor
        name: this.state.array[i].name,
        type: this.state.array[i].type,
        category: this.state.array[i].category,
        fill: this.state.array[i].fill,
        param_sport: this.state.array[i].sport,
        year: this.state.array[i].year,
        sqlfunc: this.state.array[i].sqlfunc,
      };
      this.getdatasets(url, params, chart); //fetch values from DB
    }
  }

  test() {
    fetch(BACKEND_URL + "charts/dataset?category=pace&sqlfunc=sum&year=2021", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: SessionHandler.getAuthToken(),
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
      })
      .catch((error) => console.warn(error));
  }

  getdatasets(url: string, params: any, chart: any) {
    fetch(url + params, {
      //build URL with params to make request depending on chart
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: SessionHandler.getAuthToken(),
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
        this.addElement(chart, data); //create chart with data on frontend
      })
      .catch((error) => console.warn(error));
  }

  addElement(chart: any, data: any) {
    var buttonnode = document.getElementById(chart.name); //check if ID already exists (should be unique)
    var chartnode = document.getElementById("chart_ID" + chart.name);
    if (!chartnode && !buttonnode) {
      // create new unique div and new unique button for each new chart
      var canvas = document.createElement("canvas"); //Canvas, where chart will be displayed
      canvas.id = "chartID_" + chart.name; // use chart title to create id for div
      canvas.className = chart.name;
      var button = document.createElement("button"); //Button, to delete chart
      button.id = chart.name; //Set button ID to chart title
      button.className = "button is-danger";
      button.innerHTML = "Delete " + canvas.id;
      button.onclick = (event: any) => this.removeChart(event.target.id); //add delete fnction to function
      // add created elements to DOM
      var parent = document.getElementById("charts"); //append every charts to parent div
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

  addcharts(canvas: HTMLCanvasElement, chart: any, data: any) {
    let display = true;
    if (
      //disable xaxis and yaxis for doughut, polarArea, radar, pie
      chart.type === "pie" ||
      chart.type === "doughut" ||
      chart.type === "polarArea" ||
      chart.type === "radar"
    ) {
      display = false;
    }
    if (chart.fill === 1) {   //Set fill value to ture or false
      chart.fill = true;
    } else {
      chart.fill = false;
    }

    let dataarray: any[] = new Array(labels.length);
    let ylab = this.yLab(chart.category); //get unit of measurement for chart
    let subtitle = this.subtitle(chart.category, ylab, chart.year); //create subtitle to add information for displayed chart
    dataarray.fill(0, 0, labels.length); //init  charts values
    for (let i = 0; i < data.length; i++) {
      //Assign value to labels. Set value position depending on label position
      labels.forEach((item, index) => {
        if (data[i].month === index && data[i].amount) {
          dataarray.splice(index - 1, 1, data[i].amount);
        }
      });
    }
    new Chart(canvas, {
      //Create chart
      options: {
        scales: {
          x: {
            display: display, //enable/disable axis dependind on chart type
            title: {
              text: "Month",
              display: display,
            },
          },
          y: {
            display: display,
            title: {
              display: display,
              text: [ylab], //Display unit
            },
          },
        },
        plugins: {
          title: {
            display: true,
            color: "#808080",
            text: [chart.name, subtitle],
            font: {
              size: 20,
            },
          },
        },
      },
      type: chart.type, //Define chart type
      data: {
        labels: labels,
        datasets: [
          {
            label: chart.name, //Set chart title
            backgroundColor: colors, //Set charts colors
            data: dataarray, //Set chart data
            fill: chart.fill, //Fill chart
          },
        ],
      },
    });
  }

  //Get inputs values then create charts
  configureChart() {
    if (                    //Check if mandatory values are set else reject request 
      this.state.title &&
      this.state.type &&
      this.state.year &&
      this.state.category
    ) {
      if (
        !this.state.array.find(
          (title: { name: string }) => title.name === this.state.title //Accepts request if title is unique
        )
      ) {
        let sqlfunc;
        if (this.state.switchfunc === true) {     //Set sql function depending on switch button value
          sqlfunc = "sum";
        } else {
          sqlfunc = "avg";
        }
        var year = this.state.year.getFullYear(); //filter date on year
        const chart = {                           //build chart
          name: this.state.title,
          type: this.state.type,
          category: this.state.category,
          fill: this.state.fill,
          param_sport: this.state.sport, //can be null
          year: year,
          sqlfunc: sqlfunc,
        };
        const params = new URLSearchParams();       //Add query params to request
        params.append("category", chart.category);
        params.append("sport", chart.param_sport);
        params.append("year", chart.year.toString());
        const url = BACKEND_URL + "charts/dataset?";
        this.getdatasets(url, params, chart);       //Display chart with data on frontend
        this.action();
        this.setcharts(chart);                      //Add new chart to DB
      } else {
        console.error(
          "Title was already given. Please choose an other title for your chart"
        );
      }
    } else {
      console.error("Configurtion values are missing");
    }
  }

  setcharts(chart: any) {     //Add new chart to DB
    fetch(BACKEND_URL + "charts/add", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        Authorization: SessionHandler.getAuthToken(),
      },
      body: JSON.stringify(chart),
    }).then((response) => {
      if (response.ok) {
      } else {
        console.log(response); //view response in console
      }
    });
  }

  removeChart(id: string) {   //remove chart 
    var chart = null;
    const chartID = "chartID_" + id;
    chart = Chart.getChart(chartID);  //get chart object
    if (chart) { 
      chart.destroy();                //Destroy chart object on frontend
      this.removeElement(id);         //remove element created with chart
      fetch(BACKEND_URL + "charts/remove", {
        method: "DELETE",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization: SessionHandler.getAuthToken(),
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

  removeElement(name: string) { //remove chart elements
    var canvas = document.getElementById(   
      "chartID_" + name
    ) as HTMLCanvasElement;
    var button = document.getElementById(name) as HTMLButtonElement;  
    if (canvas.parentNode && button.parentNode) {
      canvas.parentNode.removeChild(canvas);      //remove canvas element
      button.parentNode.removeChild(button);      ////remove button element
    }
  }

  yLab(category: string) {        //get unit of measurement depending on category
    var ylab = "";
    if (categories.includes(category)) {
      switch (category) {
        case "distance":
        case "altitudeDifference":
          ylab = "meter";
          break;
        case "duration":
          ylab = "seconds";
          break;
        case "pace":
          ylab = "km/h";
          break;
        case "effort":
          ylab = "calories";
          break;
        case "averageHeartRate":
          ylab = "BPM";
          break;
      }
    }
    return ylab;
  }

  subtitle(category: string, ylab: string, year: number) {
    var subtitle = `${category} in ${ylab} per month for ${year}`;  //create subtitle for chart
    return subtitle;
  }

  fill() {    //render fill switch button if specific chart type is selected
    if (this.state.type === "line" || this.state.type === "radar") {
      return (
        <div className="m-2">
          <input
            type="checkbox"
            name="fill"
            className="switch"
            id="fill"
            onChange={(fill) => this.handleOnCheck(fill)}
          />
          <label className="label" htmlFor="fill">
            {this.state.fill ? <span>Filled</span> : <span>Not filled</span>}
          </label>
        </div>
      );
    } else {
      return "";
    }
  }

  renderOptions(items: any[]) { //render options for dropdown
    return (
      items &&
      items.length > 0 &&
      items.map((item) => {
        return <option key={item}>{item}</option>;
      })
    );
  }

  handleDateOnChange(date: any) { //Update date on change
    this.setState({ year: date });
  }

  handleOnChange( //update input fields on change
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState(({
      [name]: value,
    } as unknown) as Pick<State, keyof State>);
  }

  handleOnCheck(event: any) { //update checkbox/ switch button on change
    const target = event.target;
    const name = target.name;
    var check = target.checked;
    this.setState(({
      [name]: check,
    } as unknown) as Pick<State, keyof State>);
  }

  handleCategories() {  //update categories on siwth buttons
    let newcategories = categories;
    if (this.state.switchfunc === false) {
      newcategories = newcategories.concat(averagecategories);
    }
    return this.renderOptions(newcategories);
  }

  render() {
    const active = this.state.active ? "is-active" : "";
    return (
      <div className="container">
        <div className="divider">Chart</div>
        <div className="controls">
          <button className="button is-success" onClick={() => this.action()}>
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
                  <div className="columns is-centered m-2">
                    <div className="column is-one-quarter">
                      <label className="label">Chart function</label>
                    </div>
                    <div className="column is-one-quarter">
                      <div className="field">
                        <input
                          type="checkbox"
                          name="switchfunc"
                          className="switch"
                          id="switchfunc"
                          onChange={(switchfunc) =>
                            this.handleOnCheck(switchfunc)
                          }
                        />
                        <label className="label" htmlFor="switchfunc">
                          {this.state.switchfunc ? (
                            <span>Sum</span>
                          ) : (
                            <span>Average</span>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
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
                      {this.handleCategories()}
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
                  <div>{this.fill()}</div>
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
