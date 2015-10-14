import React from 'react';

export default class App extends React.Component {
  render() {
    return (
      <div className="container">
        <hgroup>
          <h1>Jack Franklin</h1>
          <h2>Developer Evangelist at Pusher</h2>
        </hgroup>
        <div className="primary">
          { this.props.children }
        </div>
        <div className="secondary">
          <h2>Get in Touch</h2>
          <p>The best way is to email jack [at] jackfranklin [dot] net.</p>
          <p>If you're into social networks, you can <a href="http://twitter.com/Jack_Franklin">follow me on Twitter</a> or check out <a href="http://github.com/jackfranklin">code on Github</a>.</p>
        </div>
      </div>
    );
  }
}
