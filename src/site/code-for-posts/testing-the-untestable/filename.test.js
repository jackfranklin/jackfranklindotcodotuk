const { Publisher } = require('./before')

describe('Publisher', () => {
  it('truncates titles greater than 9 characters long', () => {
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

  it('includes the age range if the book is personal', () => {
    const fileName = Publisher.generateFilename({
      publishOn: new Date(2021, 3, 1),
      ageRange: 10,
      isPersonal: true,
      categoryPrefix: 'kids',
      kind: 'childrens-book',
      id: 123,
      title: 'Five go on an Adventure',
    })
    expect(fileName).toMatch(
      /2021-4kidschildrens-book123[0-9]{5}10-fivegoona\.jpg/
    )
  })

  it('does not truncate titles less than 9 characters long', () => {
    const fileName = Publisher.generateFilename({
      publishOn: new Date(2021, 3, 1),
      categoryPrefix: 'bio',
      kind: 'biography',
      id: 123,
      title: 'Jack',
    })
    expect(fileName).toMatch(/2021-4biobiography123[0-9]{5}-jack\.jpg/)
  })
})
