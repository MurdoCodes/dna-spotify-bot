module.exports = {
    sendResponse: function(res, message){
        console.log(message)        
        res.write(JSON.stringify({message: message}))
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
    }
}