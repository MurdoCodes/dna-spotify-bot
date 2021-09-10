module.exports = {
    sendResponse: function(res, message){
        console.log(message)        
        res.write(JSON.stringify({message: message}))
        // `${message}!\n\n`
        // res.status(200).json({message: `Email: available. Registraion Successful...`})
    },
    mouseMove: async function(element, page){
        try {
            let box = await element.boundingBox()
            const x = box.x + (box.width/2)
            const y = box.y + (box.height/2)
            await page.mouse.move(x,y)
            await page.mouse.click(x,y)
            return true
        }
        catch(e) {
            return true
        }
    }
}