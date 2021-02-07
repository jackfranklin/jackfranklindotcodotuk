import SideBySideSvelte from './SideBySide.svelte'

class SideBySide extends HTMLElement {
  connectedCallback() {
    const [firstCodeBlock, secondCodeBlock] = this.querySelectorAll('pre')

    const titles = [this.getAttribute('first'), this.getAttribute('second')]

    this.innerHTML = ''
    const props = {
      firstBlock: {
        title: titles[0],
        code: firstCodeBlock,
      },
      secondBlock: {
        title: titles[1],
        code: secondCodeBlock,
      },
    }
    new SideBySideSvelte({
      target: this,
      props,
    })
  }
}
customElements.define('side-by-side', SideBySide)
