import React from 'react';
import CannonHtml from 'cannon-blog/html';

export default class Wrapper extends CannonHtml {
  static childContextTypes = {
    router: React.PropTypes.func
  }

  getChildContext() {
    return { router: this.props.router };
  }

  render() {
    return (
      <html>
        <head>
          <title>{this.props.title}</title>
          <link type="text/css" rel="stylesheet" href="/css/style.css" />
          <link href='http://fonts.googleapis.com/css?family=Merriweather' rel='stylesheet' type='text/css'/>
          <link href='http://fonts.googleapis.com/css?family=Pontano+Sans' rel='stylesheet' type='text/css'/>
        </head>
        <body>
          { this.renderApp() }
          { this.renderScript() }
          <footer>
            <p>All content is &copy; Jack Franklin.</p>
          </footer>
        </body>
      </html>
    );
  }
}
