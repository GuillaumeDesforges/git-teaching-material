const marpKrokiPlugin = require('./kroki-plugin')

module.exports = {
    html: true,
    engine: ({ marp }) => marp.use(marpKrokiPlugin),
}
