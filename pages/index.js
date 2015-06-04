import React from 'react';
import CannonComponent from 'cannon/component';

export default class Index extends CannonComponent {
  constructor(props) {
    super(props)
    this.state = { count: 1 };
  }

  onClick() {
    this.setState({ count: ++this.state.count });
  }

  render() {
    return (
      <div>
        { this.state.count }
        <p>Index</p>
        { this.makeLink({to: "/about/"}, "foo") }
        <p onClick={this.onClick.bind(this)}>Increment</p>
      </div>
    );
  }
}
