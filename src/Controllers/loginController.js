const config = require(`config`)
const mouseMove = require(`../Helpers/mouseMoveHelper`)
const http = require('http')
const chromeLauncher = require('chrome-launcher');
const puppeteer = require(`puppeteer-extra`)
const StealthPlugin = require(`puppeteer-extra-plugin-stealth`)
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
const pluginProxy = require(`puppeteer-extra-plugin-proxy`)
const Ua = require('puppeteer-extra-plugin-anonymize-ua')
const ac = require(`@antiadmin/anticaptchaofficial`)
const { PrivacyApi } = require(`privacy.com`)
const UserAgent = require(`user-agents`)
const userAgent = new UserAgent()

// Config value declarations
const antiCaptchaKey = config.get(`APIKeys.antiCaptchaKey`) // AntiCaptcha API Key
const privacyApi = new PrivacyApi(config.get(`APIKeys.privacyApi`), false) // Privacy API Key
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
    initBrowser(res)
    res.send(`Login Controller`)
}

async function initBrowser(res){
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
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
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
        loginProfile(browser, page, res) 
    }catch(error){
        console.log("Error : " + error.message)
        await page.close()
        await browser.close()
        // process.exit(1);
        initBrowser(res)
    }

    // if(goto === null){
    //     await browser.close()
    // }else{
    //     loginProfile(browser, page)     
    // }
}

async function loginProfile(browser, page, res){
    const email = `e@disrupt.social`
    const password = `Peacebro66!`
    const musicTitle = `Permanent Holiday`

    await page.waitForTimeout(2000)
    let loginUsername = "input[id='login-username']"
    await page.waitForSelector(loginUsername)
    await page.type(loginUsername, email, {delay:10})
    // await res.send("Username successfully written...")

    await page.waitForTimeout(2000)
    let loginPassword = "input[id='login-password']"
    await page.waitForSelector(loginPassword)
    await page.type(loginPassword, password, {delay:10})
    // await res.send("Password successfully written...")

    await page.waitForTimeout(2000)
    let loginButton = await page.$("#login-button")
    await loginButton.click()
    // await res.send("Logging in...")

    await page.waitForTimeout(2000)
    await page.waitForSelector("a[href='/search']")
    let searchButton = await page.$("a[href='/search']")
    await searchButton.click()
    // await res.send("Clicked search feature...")

    await page.waitForTimeout(2000)
    let searchInput = "input[data-testid='search-input']"
    await page.waitForSelector(searchInput)
    await page.type(searchInput, musicTitle, {delay:10})
    // await res.send("Music title written...")

    await page.waitForTimeout(2000)
    let clickMusicContainerSelector = "#searchPage > div > div > section.e_GGK44JbOva9Ky8__wt._IVpo36IKHSqcCVm4A35 > div.WqyCHtsl8OKB9QUiAhq7 > div > div > div > div:nth-child(2) > div:nth-child(1) > div"
    let clickMusicContainerElement = await page.$(clickMusicContainerSelector)
    await page
        .waitForSelector(clickMusicContainerSelector)
        .then(() => clickMusicContainerElement.click())

    await page.waitForTimeout(2000)
    let clickMusicSelector = "#searchPage > div > div > section.e_GGK44JbOva9Ky8__wt._IVpo36IKHSqcCVm4A35 > div.WqyCHtsl8OKB9QUiAhq7 > div > div > div > div:nth-child(2) > div:nth-child(1) button"
    let clickMusicElement = await page.$(clickMusicSelector)
    await page.waitForSelector(clickMusicSelector)
        .then(() => clickMusicElement.click())
    // await res.send("Plauing Music...")

    await page.waitForTimeout(45000)
    const trackTimeElement = await page.waitForSelector('div[data-testid="playback-position"]') // select the element
    const audioTime = await trackTimeElement.evaluate((element) => {         
        return element.textContent
    })
    console.log(audioTime)
    // await res.send(`Audio Time : ${audioTime}`)
    // await res.send(`Logging Out...`)
    await page.waitForTimeout(2000)
    await page.close()
    await browser.close()
    // process.exit(1);
    // await res.send(`Browser Closed... End Process...`)

}