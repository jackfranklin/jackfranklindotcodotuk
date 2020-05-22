const { Publisher } = require('./before')

describe('Publisher', () => {
  it('does a thing', () => {
    const fileName = Publisher.generateFilename({
      publishOn: new Date(2021, 3, 1),
      categoryPrefix: 'tech',
      kind: 'software-design',
      id: 123,
      title: 'Software Design',
    })
    expect(fileName).toMatch(
      /2021-4techsoftware-design123[0-9]{5}-softwared\.jpg/
    )
  })
})
