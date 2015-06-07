import _ from 'lodash';
import CannonLayout from 'cannon-blog/layout';
import React from 'react';

export default class Default extends CannonLayout {

  posts() {
    return _.filter(this.props.routes, function(route) {
      return route.options && route.options.type === 'posts';
    });
  }

  subTitle() {
    if (this.props.route.meta.sub) {
      return <h2>{ this.props.route.meta.sub }</h2>;
    } else {
      return null;
    }
  }

  render() {
    var latestPosts = this.posts().map(function(post) {
      return (
        <li key={post.path}>
          {this.makeLink({ to: post.path }, post.meta.title)}
        </li>
      );
    }.bind(this));
    return (
      <div className="container">
        <hgroup>
          <h1>Jack Franklin</h1>
          <h2>Developer at GoCardless</h2>
        </hgroup>
        <div className="primary">
          { this.props.children }
        </div>
        <div className="secondary">
          <ul>
            <li> { this.makeLink({ to: "/" }, "Home") }</li>
          </ul>
          <h2>Latest Blogging</h2>
          <ul>{ latestPosts }</ul>

          <h2>Get in Touch</h2>
          <p>The best way is to email jack [at] jackfranklin [dot] net.</p>
          <p>If you're into social networks, you can <a href="http://twitter.com/Jack_Franklin">follow me on Twitter</a> or check out <a href="http://github.com/jackfranklin">code on Github</a>.</p>
          <h2>Buy my Book!</h2>
          <p>My first book, <a href="http://www.apress.com/9781430249320">Beginning jQuery</a>, introduces the reader to the jQuery JavaScript library. Published in February 2013.</p>
        </div>
      </div>
    );
  }
}
