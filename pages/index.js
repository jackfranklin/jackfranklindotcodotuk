import React from 'react';
import { Link } from 'react-router';

export default class IndexPage extends React.Component {
  render() {
    return (
      <div>
        <h1>Work and Open Source</h1>
        <h3>The JavaScript Playground</h3>
        <p>I run the popular <a href="http://javascriptplayground.com">JavaScript Playground</a> blog, on which I write tutorials about a variety of JavaScript topics including ES6, Gulp, Node and more.</p>

        <h3>gulp-load-plugins</h3>
        <p><a href="http://github.com/jackfranklin/gulp-load-plugins">gulp-load-plugins</a> is a Gulp plugin that makes it really easy to add and use other Gulp plugins in your project. It averages over 100,000 installs monthly on npm.</p>

        <h3>Beginning jQuery</h3>
        <p>My first physical book, <a href="http://www.apress.com/9781430249320">Beginning jQuery</a> was published in February 2013. The book aims to guide a JavaScript and jQuery novice through to a level at which they are comfortable in writing their own plugins.</p>

        <h3>Net magazine and awards</h3>
        <p>Since mid 2012 I have been a regular writer for .Net, the largest web development magazine in the UK. I wrote the JavaScript gallery section for a number of months and on JavaScript topics, including a recent cover feature on JavaScript libraries.</p>
          <p>I've twice been nominated for Net mag's Young Developer of the Year award, and once for "Best Newcomer".</p>
        </div>
    );
  }
}
