const config = require(`config`)
const jwt = require(`jsonwebtoken`)

module.exports = {
    sendResponse: function(message){
        console.log(message)        
        // res.write(JSON.stringify({message: message}))
    },
    mouseMove: async function(element, page){
        try {
            let box = await element.boundingBox()
            const x = box.x + (box.width/2)
            const y = box.y + (box.height/2)
            await page.mouse.move(x,y)
            await page.mouse.click(x, y, { clickCount: 1})
            await page.waitForTimeout(2000)
            await page.mouse.click(x, y, { clickCount: 2, delay: 100 })
            return true
        }
        catch(e) {
            return true
        }
    },
    authenticateToken: (req, res, next) => {
        const authHeader = req.headers.authorization
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null ){
            return res.status(401).json({message: `Unauthorized user`, status: false})
        }
    
        jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.sendStatus(403)
            req.user = user
            next()
        })
    },
    authRole: (role) => {
        return (req, res, next) => {
            if(req.user.role === role){
                
            }
        }
    }
}