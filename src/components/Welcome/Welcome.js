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
    fetch("https://fiuber-api-gateway-nginx.herokuapp.com/api/web/")
      .then(response => response.text())
      .then(data => this.setState({ apiCallResponse: data }))
  }
}

export default Welcome;