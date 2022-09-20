import {url} from '../../vars';
import React, { PropTypes } from 'react';
import './Welcome.css';

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiWebCallResponse: 'Loading...',
      apiMobileCallResponse: 'Loading...',
    };
  }

  render() {
    return (
      <div>
        <p>React Welcome component</p>
        <p>Rendering the content of the /api/web/ response...</p>
        {this.state.apiWebCallResponse}
        <p>Rendering the content of the /api/mobile/ response...</p>
        {this.state.apiMobileCallResponse}
      </div>
    );
  }

  componentDidMount() {
    const stringUrlWeb = url+"/api/web/";
    fetch(stringUrlWeb)
      .then(response => response.text())
      .then(data => this.setState({ apiWebCallResponse: data }))

      const stringUrlMobile = url+"/api/mobile/";
      fetch(stringUrlMobile)
        .then(response => response.text())
        .then(data => this.setState({ apiMobileCallResponse: data }))
  }
}

export default Welcome;