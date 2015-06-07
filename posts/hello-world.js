import React from 'react';
import CannonComponent from 'cannon-blog/component';

export const meta = {
  date: '2015-06-07',
  title: 'Hello World'
};

export default class HelloWorldPost extends CannonComponent {
  render() {
    return (
      <div>
        <h2>Hello World</h2>
        <p>You're reading this post on the first site I've built that's powered by <a href="http://github.com/jackfranklin/cannon-blog">Cannon</a>, a tool I've been working on for the last few weeks that lets you quickly build sites that run ReactJS on both the server and the client. This means you get lightening fast interactions in a browser with JavaScript, and any without simply hit the server like any other website.</p>

          <p>This site is largely a proof of concept for Cannon, and the fact that it's working is pretty exciting! Cannon is in early alpha at the moment and far from ready for use just yet, but I plan to keep enhancing its features and the documentation so hopefully others can benefit from this ReactJS based approach which I think is really powerful. All the difficult bits around how to run React in both client and server, configuring webpack to bundle it all together, and so on, are all dealt with by Cannon, leaving you free to build your site.</p>
      </div>
    );
  }
}
