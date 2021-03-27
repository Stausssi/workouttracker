import React, { Component } from 'react';
import './css/App.css';

class Body extends Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			apiResponse: ""
		};
	}
	
	callAPI() {
		fetch("http://157.90.160.201:9000/testAPI")
			.then(res => res.text())
			.then(res => this.setState({ apiResponse: res }));
	}

	componentWillMount() {
		this.callAPI();
	}
	
	render() {
		return (
			<section id="body-content">
				<div id="col-1">
					<h1>This is half of a page</h1>
					<p>{this.state.apiResponse}</p>
				</div>
				<div id="col-2">
					<h1>This is another half of a page</h1>
				</div>
			</section>
		);
	}
	
}

export default Body;

