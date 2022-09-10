// from https://gist.github.com/yhatt/8931dd98769bcc1c5b4b92fd1234a190
const { deflateSync } = require('zlib')

const krokiLangs = [
  'actdiag',
  'blockdiag',
  'bpmn',
  'bytefield',
  'c4plantuml',
  'ditaa',
  'dot',
  'erd',
  'excalidraw',
  'graphviz',
  'mermaid',
  'nomnoml',
  'nwdiag',
  'packetdiag',
  'pikchr',
  'plantuml',
  'rackdiag',
  'seqdiag',
  'svgbob',
  'umlet',
  'vega',
  'vegalite',
  'wavedrom',
]

const entrypoint = 'https://kroki.io/'

const marpKrokiPlugin = (md) => {
  const { fence } = md.renderer.rules

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const info = md.utils.unescapeAll(tokens[idx].info).trim()

    if (info) {
      const [_, lang, divOptions] = info.match(/(\w+)\s*(?:\{\s*(.+)\s*\})?/)

      if (krokiLangs.includes(lang)) {
        const data = deflateSync(tokens[idx].content).toString('base64url')

        // <marp-auto-scaling> is working only with Marp Core v3
        return `<p><marp-auto-scaling data-downscale-only><img src="${entrypoint}${lang}/svg/${data}" ${divOptions ? divOptions : ""}/></marp-auto-scaling></p>`
      }
    }

    return fence.call(self, tokens, idx, options, env, self)
  }
}

module.exports = marpKrokiPlugin