const { DateTime } = require('luxon')
const util = require('util')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const CleanCSS = require('clean-css')
const rss = require('@11ty/eleventy-plugin-rss')
const getSharingImage = require('@jlengstorf/get-share-image').default
const { minify } = require('terser')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight)
  eleventyConfig.addPlugin(rss)

  // Layout aliases for convenience
  eleventyConfig.addLayoutAlias('default', 'layouts/base.njk')

  // a debug utility
  eleventyConfig.addFilter('dump', (obj) => {
    return util.inspect(obj)
  })

  // Date helpers
  eleventyConfig.addFilter('readableDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc',
    }).toFormat('LLLL d, y')
  })
  eleventyConfig.addFilter('htmlDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc',
    }).toFormat('y-MM-dd')
  })

  eleventyConfig.addFilter('blogCard', (title) => {
    const url = getSharingImage({
      title,
      tagline: 'jackfranklin.co.uk',
      cloudName: 'dtzvjz9gv',
      imagePublicID: 'blog-card-template',
      titleFont: 'Georgia',
      taglineFont: 'Georgia',
    })
    return url
  })

  // minify the html output when running in prod
  if (process.env.NODE_ENV == 'production') {
    eleventyConfig.addTransform(
      'htmlmin',
      require('./src/utils/minify-html.js')
    )
  }

  // Static assets to pass through
  eleventyConfig.addPassthroughCopy('./src/site/fonts')
  eleventyConfig.addPassthroughCopy('./src/site/images')
  eleventyConfig.addPassthroughCopy('./src/site/code-for-posts')
  eleventyConfig.addPassthroughCopy('./src/site/css')

  eleventyConfig.addFilter('cssmin', function (code) {
    return new CleanCSS({}).minify(code).styles
  })

  eleventyConfig.addNunjucksAsyncFilter('jsmin', async function (
    code,
    callback
  ) {
    if (process.env.NODE_ENV == 'production') {
      try {
        const minified = await minify(code)
        callback(null, minified.code)
      } catch (err) {
        console.error('Terser error: ', err)
        // Fail gracefully.
        callback(null, code)
      }
    } else {
      callback(null, code)
    }
  })

  return {
    dir: {
      input: 'src/site',
      inludes: '_includes',
      output: 'dist',
    },
    passthroughFileCopy: true,
    templateFormats: ['njk', 'md'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  }
}
