/* This code is based on code from "Therapeutic Refactoring" by Katrina Owen
 * https://www.slideshare.net/kytrinyx/therapeutic-refactoring
 */

class Publisher {
  static generateFilename(target) {
    let fileName = `${target.publishOn.getFullYear()}-${target.publishOn.getMonth() +
      1}`

    fileName += target.categoryPrefix
    fileName += target.kind.replace('_', '')
    fileName += String(target.id)
    fileName += Array.from({ length: 5 }, _ =>
      Math.floor(Math.random() * 10)
    ).join('')

    fileName += target.isPersonal ? target.ageRange : ''

    let truncatedTitle = target.title.replace(/[^\[a-z\]]/gi, '').toLowerCase()
    let truncateTo = truncatedTitle.length > 9 ? 9 : truncatedTitle.length
    fileName += `-${truncatedTitle.slice(0, truncateTo)}`
    fileName += '.jpg'

    return fileName
  }
}
exports.Publisher = Publisher
