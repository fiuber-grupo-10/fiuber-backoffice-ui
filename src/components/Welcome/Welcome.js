import {url} from 'vars.js';
import React, { PropTypes } from 'react';
import './Welcome.css';

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiCallResponse: 0
    };
  }

  render() {
    return (
      <div>
        <p>React Welcome component</p>
        <p>Rendering the content of the /api/web response...</p>
        {this.state.apiCallResponse}
      </div>
    );
  }

  componentDidMount() {
    const stringUrl = url+"/api/web/";
    fetch(stringUrl)
      .then(response => response.text())
      .then(data => this.setState({ apiCallResponse: data }))
  }
}

export default Welcome;