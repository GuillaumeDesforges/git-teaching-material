import { exec } from "child_process"
import puppeteer from "puppeteer"
import { renderMermaid } from "@mermaid-js/mermaid-cli"
import { Marp } from "@marp-team/marp-core"
import jsdom from "jsdom"


function execWhich(command) {
    return new Promise((resolve, reject) => {
        exec(`which ${command}`, (error, stdout, stderr) => {
            if (error) {
                reject(error)
            } else {
                resolve(stdout.trim())
            }
        })
    })
}

async function renderSvgMermaid(graphDefinition) {
    const googleChromePath = await execWhich("google-chrome-stable")
    const browser = await puppeteer.launch({ executablePath: googleChromePath, headless: "new" })
    const { data } = await renderMermaid(browser, graphDefinition, "svg");
    await browser.close()
    return data.toString("utf8");
}

async function marpMermaidPlugin(md) {
    // render mermaid from fence code block
    const { fence } = md.renderer.rules
    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const info = md.utils.unescapeAll(tokens[idx].info).trim()
        if (info) {
            const [_, lang, divOptions] = info.match(/(\w+)\s*(?:\{\s*(.+)\s*\})?/)
            if (lang == "mermaid") {
                const graphDefinition = tokens[idx].content

                // <marp-auto-scaling> is working only with Marp Core v3
                return `<p><marp-auto-scaling data-downscale-only><div class="mermaid-unprocessed">${graphDefinition}</div></marp-auto-scaling></p>`
            }
        }

        return fence.call(self, tokens, idx, options, env, self)
    }
}

class PostprocessMarpitEngine extends Marp {
    constructor(options, postprocess) {
        super(options)
        this.postprocess = postprocess
    }

    withPostprocess(postprocess) {
        this.postprocess = postprocess
        return this
    }

    async render(markdown, env = {}) {
        const { html, css, comments } = super.render(markdown, env)
        if (this.postprocess) {
            return await this.postprocess(markdown, env, html, css, comments)
        }
        return { html, css, comments }
    }
}

export default {
    engine: async (constructorOptions) =>
        new PostprocessMarpitEngine(constructorOptions)
            .use(marpMermaidPlugin)
            .withPostprocess(async (markdown, env, html, css, comments) => {
                // parse html to DOM
                const doc = new jsdom.JSDOM(html)
                // turn div.mermaid-unprocessed into processed
                const mermaidUnprocessed = doc.window.document.querySelectorAll("div.mermaid-unprocessed")
                for (const div of mermaidUnprocessed) {
                    const graphDefinition = div.textContent
                    const svg = await renderSvgMermaid(graphDefinition)
                    div.outerHTML = svg
                }
                const processedHtml = doc.window.document.documentElement.outerHTML
                return { html: processedHtml, css, comments }
            }),
}
