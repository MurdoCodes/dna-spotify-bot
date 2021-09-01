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
// puppeteer.use(StealthPlugin())
// puppeteer.use(pluginProxy({
//     address: 'zproxy.lum-superproxy.io',
//     port: 22225,
//     credentials: {
//       username: 'lum-customer-c_35009731-zone-dnashoebot-country-us',
//       password: 'jiv2w#%o42of',
//     }
//   }))

// Export function
exports.login = (req, res, next) => {
    res.send(`Login Controller`)
    startProfile(req.query, res)
    next()
}

function sendResponse(res, result){ // Server to client Response
    console.log(result)
    // res.end(`${result}!\n\n`)
}

// MLA Start Profile
async function startProfile(userBotData, res){
    const profileId = userBotData['profileId']
    let mlaPort = 5001;
    sendResponse(res, `Starting MLA Profile ${profileId}`)

    http.get(`http://127.0.0.1:${mlaPort}/api/v1/profile/start?automation=true&puppeteer=true&profileId=${profileId}`, (resp) => {
    let data = '';
    let ws = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
  
    resp.on('end', () => {
      let ws;
      try {
        ws = JSON.parse(data);
      } catch(err) {
        sendResponse(res, `MLA Error : ${err}...`)
        startProfile(userBotData, res)
      }
      if (typeof ws === 'object' && ws.hasOwnProperty('value')) {        
        sendResponse(res, `Succesfully Opened Browser with Profile Id : ${profileId}...`)
        initBrowser(userBotData, res, ws.value)
      }
    });  
    }).on("error", (err) => {
      sendResponse(res, 'MLA Error : ' + err.message)
    });
}

async function initBrowser(userBotData, res, ws){

    const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--autoplay-policy=no-user-gesture-required',
        `--user-agent=${userAgent}`,
    ]
    const options = {
        browserWSEndpoint: ws,
        ignoreHTTPSErrors: true,
        headless: false,
        slowMo: 50,
        args
    }
    const browser = await puppeteer.connect(options);
    const [page] = await browser.pages()

    await page.authenticate({
        username: 'lum-customer-c_35009731-zone-dnashoebot-country-us',
        password: 'jiv2w#%o42of'
    })

    await page.setDefaultTimeout(0) // Set timeout to 0
    await page.setViewport({ width: 1366, height: 691, deviceScaleFactor: 1, })
    await page.evaluateOnNewDocument(() => {
        delete navigator.__proto__.webdriver
    })

    const goto = await page.goto(siteUrl, {waitUntil: 'networkidle2', timeout: 0})
    
    if(goto === null){
        sendResponse(res, 'Cant get the site url... Process Stopped!!!')
        await browser.close()
    }else{
        sendResponse(res, 'Connected to the site...')
        await loginProfile(page)
    }

}

async function loginProfile(page){
    const email = `e@disrupt.social`
    const password = `Peacebro66!`
    const musicTitle = `Permanent Holiday`

    await page.waitForTimeout(3000)
    let loginUsername = "input[id='login-username']"
    await page.waitForSelector(loginUsername)
    await page.type(loginUsername, email, {delay:10})

    await page.waitForTimeout(3000)
    let loginPassword = "input[id='login-password']"
    await page.waitForSelector(loginPassword)
    await page.type(loginPassword, password, {delay:10})

    await page.waitForTimeout(3000)
    let loginButton = await page.$("#login-button")
    await loginButton.click()

    await page.waitForTimeout(3000)
    await page.waitForSelector("a[href='/search']")
    let searchButton = await page.$("a[href='/search']")
    await searchButton.click()

    await page.waitForTimeout(3000)
    let searchInput = "input[data-testid='search-input']"
    await page.waitForSelector(searchInput)
    await page.type(searchInput, musicTitle, {delay:10})

    await page.waitForTimeout(3000)
    let clickMusicContainer = await page.$("#searchPage > div > div > section.e_GGK44JbOva9Ky8__wt._IVpo36IKHSqcCVm4A35 > div.WqyCHtsl8OKB9QUiAhq7 > div > div > div > div:nth-child(2) > div:nth-child(1) > div")
    await clickMusicContainer.click()

    await page.waitForTimeout(3000)
    let clickMusic = await page.$("#searchPage > div > div > section.e_GGK44JbOva9Ky8__wt._IVpo36IKHSqcCVm4A35 > div.WqyCHtsl8OKB9QUiAhq7 > div > div > div > div:nth-child(2) > div:nth-child(1) button")
    await clickMusic.click()
}