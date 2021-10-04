// Require Modules
const config = require(`config`)
const puppeteer = require(`puppeteer-extra`)
const StealthPlugin = require(`puppeteer-extra-plugin-stealth`)
const pluginProxy = require(`puppeteer-extra-plugin-proxy`)
const UserAgent = require(`user-agents`)
const userAgent = new UserAgent()

// Require Helpers
const Task = require(`../Models/taskModel`)
const helper = require("../Helpers/helper")
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
exports.login = (data) => {
    console.log(`Initializing Request...`)
    initBrowser(data)
}

async function initBrowser(data){
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
        // executablePath : '/usr/bin/google-chrome-stable',
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
            console.log(`Loading website to browser...`)
            loginProfile(browser, page, data) 
        }        
    }catch(error){
        await page.close()
        await browser.close()
        console.log(`Failed to load website! Retrying...`)
        initBrowser(data)
    }
}

async function loginProfile(browser, page, data) {
    console.log('Successfully loaded spotify website...')

    const email = data['email']
    const password = data['password'] 

    await page.waitForTimeout(2000)
    let loginUsername = "input[id='login-username']"
    await page.waitForSelector(loginUsername)
    await page.type(loginUsername, email, {delay:10})
    console.log( 'Username successfully written...')

    await page.waitForTimeout(2000)
    let loginPassword = "input[id='login-password']"
    await page.waitForSelector(loginPassword)
    await page.type(loginPassword, password, {delay:10})
    console.log('Password successfully written...')

    await page.waitForTimeout(2000)
    let loginButton = await page.$("#login-button")
    await loginButton.click()
    console.log('Logging in...')

    await page.waitForNavigation({ waitUntil: 'networkidle2' })             
    console.log('Succesfully Logged in...')
    await dashboard(browser, page, data)
       
}

async function dashboard(browser, page, data){   
    const musicTitle = data['musicTitle']
    await page.waitForTimeout(2000)   

    try {
        await page.waitForSelector("a[href='/search']")
        console.log('Login Success...')

        let searchButton = await page.$("a[href='/search']")
        await searchButton.click()
        console.log('Clicked search feature...')

    } catch (error) {
        console.log('Element not found retry process...')
        page.close()
        browser.close()
        initBrowser(data)
    }

    try{
        sendResponse(res, 'Clicked sub search feature...')
        await page.waitForSelector(`#main > div > section > button`, {timeout: 1000})
       
        let subSearchButton = await page.$("#main > div > section > button")
        await page.click(`#main > div > section > button`)   
    }catch(error){
        await page.waitForTimeout(2000)
        let searchInput = "input[data-testid='search-input']"
        await page.waitForSelector(searchInput)
        await page.type(searchInput, musicTitle, {delay:10})
        console.log(`Writing ${musicTitle} Title on search bar...`)

        playMusic(browser, page, data)
    }
}

async function playMusic(browser, page, data){
    const musicTitle = data['musicTitle']

    await page.waitForTimeout(2000)   

    try {
        let clickMusicContainerSelector = "#searchPage > div > div > section.e_GGK44JbOva9Ky8__wt._IVpo36IKHSqcCVm4A35 > div.WqyCHtsl8OKB9QUiAhq7 > div > div > div > div:nth-child(2) > div:nth-child(1) > div"

        await page.waitForSelector(clickMusicContainerSelector)

        let clickMusicContainerElement = await page.$(clickMusicContainerSelector)

        clickMusicContainerElement.click()
        mouseMove(clickMusicContainerElement, page)
        
        console.log(`${musicTitle} music selected. Starting to play `)
        await page.waitForTimeout(3000)
        console.log(`Playing ${musicTitle}... `)
    } catch (error) {
        console.log(error)
        res.end('Failed to play music!')
    }

    await page.waitForTimeout(60000)
    const trackTimeElement = await page.waitForSelector('div[data-testid="playback-position"]') // select the element
    const audioTime = await trackTimeElement.evaluate((element) => {         
        return element.textContent
    })
    console.log(`Music Time : ${audioTime}`)

    await page.waitForTimeout(2000)
    const id = data['id']
    const result = await Task.updateSingleTask( id )
    
    if(result){       
        console.log(`Logging out...`)
        await browser.close()
        await page.waitForTimeout(2000)
        console.log(`Browser Closed... End Process...`)
    }    
}