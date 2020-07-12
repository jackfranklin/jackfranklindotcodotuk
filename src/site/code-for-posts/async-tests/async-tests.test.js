const EventEmitter = require('events')

class Page extends EventEmitter {
  makeRequest(url) {
    this.emit('request_started', { url })
  }
}

describe('Page class', () => {
  it('emits an event when a request is started', () => {
    const page = new Page()
    const handler = jest.fn()

    page.on('request_started', handler)
    page.makeRequest('www.foo.com')

    expect(handler).toBeCalledTimes(1)
    expect(handler).toBeCalledWith({
      url: 'www.foo.com',
    })
  })
})
