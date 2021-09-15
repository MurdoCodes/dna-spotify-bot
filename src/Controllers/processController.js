// Require Modules
const config = require(`config`)
const puppeteer = require(`puppeteer-extra`)
const StealthPlugin = require(`puppeteer-extra-plugin-stealth`)
const pluginProxy = require(`puppeteer-extra-plugin-proxy`)
const UserAgent = require(`user-agents`)
const userAgent = new UserAgent()

// Require Helpers
const helper = require("../Helpers/helper")
const sendResponse = helper.sendResponse
const mouseMove = helper.mouseMove

// Config value declarations
const siteUrl = config.get(`siteUrl`) // Site Url

// Use puppeteer modules
puppeteer.use(StealthPlugin())
puppeteer.use(pluginProxy({
    address: config.get(`ProxyServer.address`),
    port: config.get(`ProxyServer.port`),
    credentials: {
      username: config.get(`ProxyServer.username`),
      password: config.get(`ProxyServer.password`),
    }
  }))

// Export function
exports.login = (req, res, next) => {
    res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive'
      })
    res.flushHeaders()

    sendResponse(res, `Initializing Request...`)
    initBrowser(req.query, res)
    // next()
}

async function initBrowser(data, res){
    const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--autoplay-policy=no-user-gesture-required',
        `--user-agent=${userAgent}`,
    ]    
    const options = {
        slowMo: 25,
        headless: false,
        ignoreDefaultArgs: ['--mute-audio'],
        // executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        executablePath : '/usr/bin/google-chrome-stable',
        args
    }

    const browser = await puppeteer.launch(options)
    const page = await browser.newPage()
    
    const client = await page.target().createCDPSession();
    await client.send('Network.clearBrowserCookies');
    await client.send('Network.clearBrowserCache');

    const pages = await browser.pages() 
    if (pages.length > 1) { await pages[0].close() }

    await page.setViewport({ width: 1920, height: 937, deviceScaleFactor: 1, })
    await page.setDefaultTimeout(0)

    await page.evaluateOnNewDocument(() => {
        delete navigator.__proto__.webdriver;
    })

    try{
        const goto = await page.goto(siteUrl, {waitUntil: 'networkidle2', timeout: 0})
        if(goto){
            sendResponse(res, `Loading website to browser...`)
            loginProfile(browser, page, data, res) 
        }        
    }catch(error){
        await page.close()
        await browser.close()
        sendResponse(res, `Failed to load website! Retrying...`)
        initBrowser(data, res)
    }
}

async function loginProfile(browser, page, data, res) {
    sendResponse(res, 'Successfully loaded spotify website...')

    const email = data['email']
    const password = data['password']
    const musicTitle = data['musicTitle']    

    await page.waitForTimeout(2000)
    let loginUsername = "input[id='login-username']"
    await page.waitForSelector(loginUsername)
    await page.type(loginUsername, email, {delay:10})
    sendResponse(res, 'Username successfully written...')

    await page.waitForTimeout(2000)
    let loginPassword = "input[id='login-password']"
    await page.waitForSelector(loginPassword)
    await page.type(loginPassword, password, {delay:10})
    sendResponse(res, 'Password successfully written...')

    await page.waitForTimeout(2000)
    let loginButton = await page.$("#login-button")
    await loginButton.click()
    sendResponse(res, 'Logging in...')

    if(page.url() === siteUrl){
        console.log('False')
    }else{
        sendResponse(res, 'Succesfully Logged in...')
    }

    await page.waitForTimeout(2000)
    await page.waitForSelector("a[href='/search']")
    sendResponse(res, 'Login Success...')
    let searchButton = await page.$("a[href='/search']")
    await searchButton.click()
    sendResponse(res, 'Clicked search feature...')

    await page.waitForTimeout(2000)
    let searchInput = "input[data-testid='search-input']"
    await page.waitForSelector(searchInput)
    await page.type(searchInput, musicTitle, {delay:10})
    sendResponse(res, `Writing ${musicTitle} Title on search bar...`)

    await page.waitForTimeout(2000)
    let clickMusicContainerSelector = "#searchPage > div > div > section.e_GGK44JbOva9Ky8__wt._IVpo36IKHSqcCVm4A35 > div.WqyCHtsl8OKB9QUiAhq7 > div > div > div > div:nth-child(2) > div:nth-child(1) > div"
    let clickMusicContainerElement = await page.$(clickMusicContainerSelector)
    await page
        .waitForSelector(clickMusicContainerSelector)
        .then(() => mouseMove(clickMusicContainerElement, page) )
        // clickMusicContainerElement.click()
        
    sendResponse(res, `${musicTitle} music selected... `)

    await page.waitForTimeout(2000)
    let clickMusicSelector = "#searchPage > div > div > section.e_GGK44JbOva9Ky8__wt._IVpo36IKHSqcCVm4A35 > div.WqyCHtsl8OKB9QUiAhq7 > div > div > div > div:nth-child(2) > div:nth-child(1) button"
    let clickMusicElement = await page.$(clickMusicSelector)
    await page.waitForSelector(clickMusicSelector)
        .then(() => mouseMove(clickMusicElement, page))
    sendResponse(res, `Playing ${musicTitle}... `)

    await page.waitForTimeout(60000)
    const trackTimeElement = await page.waitForSelector('div[data-testid="playback-position"]') // select the element
    const audioTime = await trackTimeElement.evaluate((element) => {         
        return element.textContent
    })
    sendResponse(res, `Music Time : ${audioTime}`)
    await page.waitForTimeout(2000)
    sendResponse(res, `Logging out...`)
    await page.close()
    await browser.close()
    await page.waitForTimeout(2000)
    sendResponse(res, `Browser Closed... End Process...`)
}