import React from 'react';
import { Link } from 'react-router';

export default class IndexPage extends React.Component {
  render() {
    return (
      <div>
        <p>Home Page</p>
        <Link to='/about'>About</Link>
      </div>
    );
  }
}
