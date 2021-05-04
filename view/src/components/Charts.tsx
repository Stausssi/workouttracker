import React from "react";
import Chart from "chart.js/auto";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import en from "date-fns/locale/en-GB";
import "react-datepicker/dist/react-datepicker.css";
import SessionHandler from "../utilities/SessionHandler";
import {BACKEND_URL} from "../App";
import "bulma-extensions/bulma-switch/dist/css/bulma-switch.min.css";
import NotificationBox from "./NotificationBox";

interface Props {
}

interface State {
    active: boolean;
    title: string;
    type: string;
    category: string;
    sport: string;
    year: Date;
    fill: boolean;
    array: any[];
    sports: string[];
    switchfunc: boolean;
    notifyMessage: string;
    notifyType: string;
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

const types = ["line", "bar", "radar", "polarArea", "doughnut", "pie"];

const allCategories = [
    "distance",
    "duration",
    "altitudeDifference",
    "averageHeartRate",
    "pace",
];

const categories = ["distance", "duration", "altitudeDifference"];

const averageCategories = ["averageHeartRate", "pace"];

const initialState = {
    active: false,
    title: "",
    type: "line",
    category: "distance",
    sport: "",
    fill: false,
    array: [],
    sports: [],
    switchfunc: false,
    year: new Date(),
    notifyMessage: "",
    notifyType: "",
};

export default class Graphs extends React.Component<Props, State> {
    private readonly abortController: AbortController;
    charts: any[];

    constructor(props: Props) {
        super(props);
        this.state = initialState; //init state
        this.charts = [];
        this.abortController = new AbortController();
    }

    action = () => {
        //open and close modal
        let active = !this.state.active;
        if (active) {
            this.fetchSports(); //fetch sports from database 
            this.setState(() => ({active: active}));
        } else {
            this.setState(initialState); //reset state on close
        }
    };

    componentDidMount() {
        this.getCharts(true); //get charts with data on mount
    }

    componentWillUnmount() {
        this.abortController.abort();
    }

    fetchSports() {
        // Fetch sports, users and category from database
        fetch(BACKEND_URL + "sports/fetch", {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: SessionHandler.getAuthToken(),
            },
            signal: this.abortController.signal,
        }).then((response) => {
            if (response.ok) {
                return response.json().then((response) => {
                    let data = JSON.parse(response.body);
                    let sports = [];
                    sports.push("");
                    for (let key in data) {
                        if (data.hasOwnProperty(key)) {
                            sports.push(key);
                        }
                    }
                    this.setState({sports: sports});
                });
            } else {
                return response.json().then((response) => {
                    console.error("Sport Fetch failed:", response);
                    this.setState({sports: []});
                });
            }
        });
    }

    //get charts
    getCharts(display: boolean) {
        // Call the API
        fetch(BACKEND_URL + "charts/get", {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: SessionHandler.getAuthToken(),
            },
            signal: this.abortController.signal,
        }).then((response) => {
            if (response.ok) {
                return response.json().then((response) => {
                    this.setState({array: JSON.parse(response.body)}, () => {
                        if (display) {
                            //if displayed add data to charts and displayed it
                            this.loopOverData(); //get data for each chart
                        }
                    });
                });
            } else {
                return response.json().then((response) => {
                    console.error("Failed to get charts: ", response); //error message in console on error
                });
            }
        });
    }


    //loop over each chart
    loopOverData() {
        for (let i = 0; i < this.state.array.length; i++) {
            const chart = {
                //build chart constructor
                name: this.state.array[i].name,
                type: this.state.array[i].type,
                category: this.state.array[i].category,
                fill: this.state.array[i].fill,
                param_sport: this.state.array[i].param_sport,
                year: this.state.array[i].year,
                sqlfunc: this.state.array[i].sqlfunc,
            };
            this.createRequest(chart);
        }
    }

    //create reqeust depending on values
    createRequest(chart: any) {
        let year, sport, category, sqlfunc;
        const params = new URLSearchParams(); //create query params for request
        if (chart.category) {
            category = chart.category;
            params.append("category", category);
        }
        if (chart.sqlfunc) {
            sqlfunc = chart.sqlfunc;
            params.append("sqlfunc", sqlfunc);
        }
        if (chart.param_sport) {
            sport = chart.param_sport;
            params.append("sport", sport);
        }
        if (chart.year) {
            year = chart.year;
            params.append("year", year);
        }
        const url = BACKEND_URL + "charts/dataset?";
        this.getDatasets(url, params, chart); 
    }

    //fetch values from database
    getDatasets(url: string, params: any, chart: any) {
        fetch(url + params, {                   //build URL with params to make request depending on chart
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: SessionHandler.getAuthToken(),
            },
            signal: this.abortController.signal,
        }).then((response) => {
            if (response.ok) {
                return response.json().then((response) => {
                    let data = JSON.parse(response.body);
                    this.addElement(chart, data); 
                });
            } else {
                return response.json().then((response) => {
                    console.error("Fetch has failed:", response);
                });
            }
        });
    }

    //create chart with data on frontend
    addElement(chart: any, data: any) {
        let buttonNode = document.getElementById(chart.name); 
        let chartNode = document.getElementById("chart_ID" + chart.name);
        let chartBoxNode = document.getElementById("chartBox_ID" + chart.name);
        if (!chartNode && !buttonNode && !chartBoxNode) {               //check if elements already exist (should be unique)
            // create new unique div and new unique button for each new chart
            let chartBox = document.createElement("div");           //create box where chart and button will be stored
            chartBox.className = "box";
            chartBox.style.maxHeight = "600px";
            chartBox.id = "chartBoxID_" + chart.name; 
            let canvas = document.createElement("canvas");          //Canvas, where chart will be displayed
            canvas.id = "chartID_" + chart.name;         
            canvas.style.maxHeight = "85%";
            canvas.style.width = "100%";                            
            let button = document.createElement("button");          //Button, to delete chart
            button.id = chart.name; //Set button ID to chart title
            button.className = "button is-danger m-1";
            button.innerHTML = "Delete " + canvas.id;
            button.onclick = (event: any) => this.removeChart(event.target.id); //add delete function to button
            // add created elements to DOM
            let parent = document.getElementById("charts");                 
            parent?.appendChild(chartBox);                                      //append  box as container to parent div
            chartBox?.append(canvas)                                            //append canvas to box
            chartBox?.appendChild(button);                                      //append buttn to box
            this.addCharts(canvas, chart, data);
        } else {
            console.error("Element could not be added");
        }
    }

    //create chart
    addCharts(canvas: HTMLCanvasElement, chart: any, data: any) {
        let display = true;
        if (                                      //disable x-axis and y-axis for doughnut, polarArea, radar, pie
            chart.type === "pie" ||
            chart.type === "doughnut" ||
            chart.type === "polarArea" ||
            chart.type === "radar"
        ) {
            display = false;
        }
        chart.fill = chart.fill === 1;                              //Set fill value to true or false
        let dataArray: any[] = new Array(labels.length);            //array for chart data
        let yLab = this.yLab(chart.category);                       //get unit of measurement for chart
        let subtitle = this.subtitle(                               //create subtitle to add information for displayed chart
            chart.category,
            yLab,
            chart.year,
            chart.param_sport
        ); 
        dataArray.fill(0, 0, labels.length);                            //init  charts values
        for (let i = 0; i < data.length; i++) {
            labels.forEach((item, index) => {
                if (data[i].month === index && data[i].amount) {
                    dataArray.splice(index - 1, 1, data[i].amount);      //Set value position depending on label position
                }   
            });
        }
        new Chart(canvas, {                             //Create chart on created canvas
            options: {                  
                responsive: true,                       //set chart static height
                maintainAspectRatio: false,             //disable maintaining ratio of chart when resizing
                scales: {                               //add options to axis
                    x: {
                        display: display,               //enable/disable axis depending on chart type
                        title: {
                            text: "Month",
                            display: display,
                        },
                    },
                    y: {
                        display: display,
                        title: {
                            display: display,
                            text: [yLab],           //Display unit
                        },
                    },
                },
                plugins: {
                    title: {                        //set options for chart title and subtitle
                        display: true,
                        color: "#808080",
                        text: [chart.name, subtitle],
                        font: {
                            size: 20,
                        },
                    },
                },
            },
            height: "auto",                      
            type: chart.type,                  //Define chart type
            data: {
                labels: labels,                 //set values for y-axis
                datasets: [
                    {
                        label: chart.name,          //add chart title to dataset
                        backgroundColor: colors,    //Set charts colors
                        data: dataArray,            //Set chart data (x-axis values)
                        fill: chart.fill,           //Fill chart
                    },
                ],
            },
        });
    }

    //Get inputs values then create charts
    configureChart() {
        if (                                    //Check if mandatory values are set else reject request
            this.state.title &&
            this.state.type &&
            this.state.year &&
            this.state.category
        ) {
            this.getCharts(false);
            if (
                !this.state.array.find(
                    (title: { name: string }) => title.name === this.state.title    //Accepts request if title is unique
                )
            ) {
                let sqlfunc;
                if (this.state.switchfunc) {    //Set sql function depending on switch button value
                    sqlfunc = "sum";
                } else {
                    sqlfunc = "avg";
                }
                let year = this.state.year.getFullYear();   //filter date on year
                const chart = {                                    
                    name: this.state.title,
                    type: this.state.type,
                    category: this.state.category,
                    fill: this.state.fill,
                    param_sport: this.state.sport, 
                    year: year,
                    sqlfunc: sqlfunc,
                };
                this.createRequest(chart);   //create request
                this.setCharts(chart);      //Add new chart to DB
                this.action();              //close modal
            } else {                        
                this.setState({
                    notifyMessage:
                        "Title was already given. Please choose an other title for your chart",
                    notifyType: "is-danger",
                });
            }
        } else {
            this.setState({
                notifyMessage: "Configuration values are missing",
                notifyType: "is-danger",
            });
        }
    }


    //Add new chart to DB
    setCharts(chart: any) {
        fetch(BACKEND_URL + "charts/add", {
            method: "POST",
            headers: {
                accept: "application/json",
                "content-type": "application/json",
                Authorization: SessionHandler.getAuthToken(),
            },
            body: JSON.stringify(chart),
            signal: this.abortController.signal,
        }).then((response) => {
            if (!response.ok) {
                return response.json().then((response) => {
                    this.setState({
                        notifyMessage:
                            "Event could not be added to database. Please contact an administrator for more information. Error is: " +
                            response,
                        notifyType: "is-danger",
                    });
                });
            }
        });
    }

    //remove chart with id
    removeChart(id: string) {
        const chartID = "chartID_" + id;
        let chart = Chart.getChart(chartID); //get chart object
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
                body: JSON.stringify({chartId: id}),
                signal: this.abortController.signal,
            }).then((response) => {
                if (response.ok) {
                    SessionHandler.setRefreshFeed(true);
                } else {
                    console.error("Delete request has failed");
                }
            });
        }
    }

    //remove chart elements
    removeElement(name: string) {
        let canvas = document.getElementById(
            "chartID_" + name
        ) as HTMLCanvasElement;
        let button = document.getElementById(name) as HTMLButtonElement;
        let box = document.getElementById("chartBoxID_" + name) as HTMLDivElement;
        if (canvas.parentNode && button.parentNode && box.parentNode) {
            canvas.parentNode.removeChild(canvas); //remove canvas element
            button.parentNode.removeChild(button); //remove button element
            box.parentNode.removeChild(box);      //remove box after children
        }
    }

    //get unit of measurement depending on category
    yLab(category: string) {
        let yLab = "";
        if (allCategories.includes(category)) {
            switch (category) {
                case "distance":
                case "altitudeDifference":
                    yLab = "meter";
                    break;
                case "duration":
                    yLab = "seconds";
                    break;
                case "pace":
                    yLab = "km/h";
                    break;
                case "effort":
                    yLab = "calories";
                    break;
                case "averageHeartRate":
                    yLab = "BPM";
                    break;
            }
        }
        return yLab;
    }

    subtitle(category: string, yLab: string, year: number, sport: string) {
        let subtitle;
        if (sport && sport !== "") {
            subtitle = `${category} in ${yLab} per month for ${year} and for ${sport}`; //create subtitle for chart with defined chart
        } else {
            subtitle = `${category} in ${yLab} per month for ${year} and for all sports`; //create subtitle for chart without defined chart
        }
        return subtitle;
    }

    //render switch button for specific charts
    fill() {
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

    //render options for dropdown
    renderOptions(items: any[]) {
        return (
            items &&
            items.length > 0 &&
            items.map((item) => {
                return <option key={item}>{item}</option>;
            })
        );
    }

    //Update date on change
    handleDateOnChange(date: any) {
        this.setState({year: date});
    }

    //update input fields on change
    handleOnChange(
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

    //update checkbox/ switch button on change
    handleOnCheck(event: any) {
        const target = event.target;
        const name = target.name;
        let check = target.checked;
        this.setState(({
            [name]: check,
        } as unknown) as Pick<State, keyof State>);
    }

    //update categories on switch buttons
    handleCategories() {
        let newCategories = categories;
        if (!this.state.switchfunc) {
            newCategories = newCategories.concat(averageCategories);
        }
        return this.renderOptions(newCategories);
    }

    render() {
        const active = this.state.active ? "is-active" : "";
        return (
            <div className="container">
                <div className="divider">Charts</div>
                <div className="controls">
                    <button className="button is-primary" onClick={() => this.action()}>
                        Add Chart
                    </button>
                </div>
                <div id="charts" className="p-5"/>
                <div className={`modal ${active}`} id="ChartModal">
                    <div className="modal-background"/>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Chart Modal</p>
                            <button
                                className="delete"
                                aria-label="close"
                                onClick={() => this.action()}
                            />
                        </header>
                        <section className="modal-card-body">
                            <div className="content">
                                <div className="control">
                                    <NotificationBox
                                        message={this.state.notifyMessage}
                                        type={this.state.notifyType}
                                        hasDelete={false}
                                    />
                                    <label className="label">Chart Name</label>
                                    <input
                                        className="input"
                                        id="chartTitle"
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
                                    <div className="columns is-centered">
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
                                    <div className="is-divider" data-content="Optional"/>
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
                                <FontAwesomeIcon icon={faCheck}/>
                                <span className="m-2">Save</span>
                            </button>
                            <button
                                className="button is-danger"
                                onClick={() => this.action()}
                            >
                                <FontAwesomeIcon icon={faTimes}/>
                                <span className="m-2">Cancel</span>
                            </button>
                        </footer>
                    </div>
                </div>
            </div>
        );
    }
}
