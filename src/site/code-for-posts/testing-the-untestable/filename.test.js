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

  it('removes the first underscore from the kind', () => {
    const fileName = Publisher.generateFilename({
      publishOn: new Date(2021, 3, 1),
      categoryPrefix: 'bio',
      kind: 'self_biography',
      id: 123,
      title: 'Title',
    })
    expect(fileName).toMatch(/2021-4bioselfbiography123[0-9]{5}-title\.jpg/)
  })

  it('does not remove any subsequent underscores from the kind', () => {
    const fileName = Publisher.generateFilename({
      publishOn: new Date(2021, 3, 1),
      categoryPrefix: 'bio',
      kind: 'self_bio_graphy',
      id: 123,
      title: 'Title',
    })
    expect(fileName).toMatch(/2021-4bioselfbio_graphy123[0-9]{5}-title\.jpg/)
  })

  it('does not remove braces or letters from the book title', () => {
    const fileName = Publisher.generateFilename({
      publishOn: new Date(2021, 3, 1),
      categoryPrefix: 'bio',
      kind: 'biography',
      id: 123,
      title: 'My [Title]',
    })
    expect(fileName).toMatch(/2021-4biobiography123[0-9]{5}-my\[title\]\.jpg/)
  })

  it('removes other special characters from the book title', () => {
    const fileName = Publisher.generateFilename({
      publishOn: new Date(2021, 3, 1),
      categoryPrefix: 'bio',
      kind: 'biography',
      id: 123,
      title: '(My) <title$>',
    })
    expect(fileName).toMatch(/2021-4biobiography123[0-9]{5}-mytitle\.jpg/)
  })
})
