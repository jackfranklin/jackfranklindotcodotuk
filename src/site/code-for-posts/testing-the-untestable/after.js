class Publisher {
  static generateFilename(target) {
    const parts = [
      publishDatePart(target),
      target.categoryPrefix,
      kindPart(target),
      String(target.id),
      randomPart(),
      target.isPersonal ? target.ageRange : '',
      titlePart(target),
    ].filter(Boolean)

    const extension = '.jpg'
    return parts.join('-') + extension
  }
}

const titlePart = (target) => {
  let truncatedTitle = target.title.replace(/[^\[a-z\]]/gi, '').toLowerCase()
  let truncateTo = truncatedTitle.length > 9 ? 9 : truncatedTitle.length
  return truncatedTitle.slice(0, truncateTo)
}

const randomPart = () => {
  return Array.from({ length: 5 }, (_) => Math.floor(Math.random() * 10)).join(
    ''
  )
}
const kindPart = (target) => {
  return target.kind.replace('_', '')
}

const publishDatePart = (target) => {
  return `${target.publishOn.getFullYear()}-${target.publishOn.getMonth() + 1}`
}

exports.Publisher = Publisher
