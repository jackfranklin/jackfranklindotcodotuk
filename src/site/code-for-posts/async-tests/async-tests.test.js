const EventEmitter = require('events')

class Page extends EventEmitter {
  makeRequest(url) {
    // this.emit('request_started', { url })
  }
}

describe('Page class', () => {
  it('emits an event when a request is started', () => {
    const page = new Page()
    // expect.assertions(1)

    page.on('request_started', (data) => {
      expect(data.url).toEqual('www.foo.com')
    })

    page.makeRequest('www.foo.com')
  })
})
