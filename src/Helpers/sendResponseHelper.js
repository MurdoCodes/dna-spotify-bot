exports.sendResponse = async function (res, result) { 
    console.log(result)
    res.write(`${result}!\n\n`)
}