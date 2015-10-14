import React from 'react';

export default class HtmlDocument extends React.Component {
  static propTypes = {
    markup: React.PropTypes.string.isRequired,
  }

  render() {
    return (
      <html>
        <head>
          <title>Jack Franklin</title>
          <link href="/css/style.css" rel="stylesheet" type="text/css" />
        </head>
        <body>
          <div id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>
        </body>
      </html>
    );
  }
}
