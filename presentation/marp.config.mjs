import puppeteer from "puppeteer"
import { Marp } from "@marp-team/marp-core"
import jsdom from "jsdom"
import path from 'path'
import url from 'url'

const __dirname = url.fileURLToPath(new url.URL('.', import.meta.url))


async function marpMermaidPlugin(md) {
    /* Render mermaid fenced code block to a placeholder for post-processing */

    // super fence block rule
    const { fence } = md.renderer.rules
    // final fence block rule
    md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const info = md.utils.unescapeAll(tokens[idx].info).trim()
        if (info) {
            const [_, lang, divOptions] = info.match(/(\w+)\s*(?:\{\s*(.+)\s*\})?/)
            if (lang == "mermaid") {
                const graphDefinition = tokens[idx].content
                return `<div class="__mermaid" ${divOptions}>${graphDefinition}</div>`
            }
        }

        return fence.call(self, tokens, idx, options, env, self)
    }
}

class PostprocessMarpitEngine extends Marp {
    /*
    Custom Marp engine with async post-processing
    Useful for async rendering
    https://github.com/markdown-it/markdown-it/issues/248
    */
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

export async function batchProcess(fn, items, batchSize = 5) {
    /* Process Promise objects in batches */
    let results = [];
    for (let start = 0; start < items.length; start += batchSize) {
        const end = start + batchSize > items.length ? items.length : start + batchSize;

        const slicedResults = await Promise.all(items.slice(start, end).map(fn));

        results = [
            ...results,
            ...slicedResults,
        ]
    }

    return results;
}


async function renderSvgMermaid(graphDefinition) {
    /*
    Render mermaid graph to svg using puppeteer
    */

    // don't forget to set PUPPETEER_EXECUTABLE_PATH
    const browser = await puppeteer.launch({
        headless: "new",
        ignoreHTTPSErrors: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            '--disable-gpu',
            '--full-memory-crash-report',
            '--unlimited-storage',
        ],
        // uncomment for advanced debugging
        // dumpio: true,
    })
    const page = await browser.newPage()
    page.on('console', (msg) => {
        console.log(msg.text())
    })
    // add container to page
    await page.evaluate(() => {
        const graphDiv = document.createElement("div")
        graphDiv.id = "graphDiv"
        document.body.appendChild(graphDiv)
    });
    // add mermaid script to page
    await page.addScriptTag({
        path: path.join(__dirname, "vendor/mermaid.min.js"),
    })
    // render graph
    const svg = await page.evaluate(async (graphDefinition) => {
        const { svg } = await mermaid.render("graphDiv", graphDefinition);
        return svg
    }, graphDefinition)
    await browser.close()
    return svg;
}

async function processMermaidDiv(div) {
    const graphDefinition = div.textContent
    const svg = await renderSvgMermaid(graphDefinition)
    div.innerHTML = svg
    div.children[0].setAttribute("width", "100%")
    div.children[0].setAttribute("height", "100%")
}

async function syncProcessMermaidDivs(mermaidDivs) {
    /* Process mermaid div, one at a time */
    for (let i = 0; i < mermaidDivs.length; i++) {
        const div = mermaidDivs[i]
        await processMermaidDiv(div)
        console.log(`${i + 1}/${mermaidDivs.length}`)
    }
}

async function batchProcessMermaidDivs(mermaidDivs) {
    /* Process mermaid divs in batches */
    await batchProcess(processMermaidDiv, Array.from(mermaidDivs))
}

export default {
    engine: async (constructorOptions) =>
        new PostprocessMarpitEngine(constructorOptions)
            .use(marpMermaidPlugin)
            .withPostprocess(async (markdown, env, html, css, comments) => {
                // parse html to DOM
                const doc = new jsdom.JSDOM(html)
                // turn div.mermaid-unprocessed into processed
                const mermaidDivs = doc.window.document.querySelectorAll("div.__mermaid")
                console.log(`Processing ${mermaidDivs.length} mermaid divs...`)
                await syncProcessMermaidDivs(mermaidDivs)
                const processedHtml = doc.window.document.documentElement.outerHTML
                return { html: processedHtml, css, comments }
            }),
}
