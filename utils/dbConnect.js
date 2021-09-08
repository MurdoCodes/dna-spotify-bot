const mysql = require(`mysql2`)
const config = require(`config`)

const pool = mysql.createPool({
	host				: config.dbConfig.host,
	user				: config.get("dbConfig.user"),
	password			: config.get("dbConfig.pass"),
	database			: config.get("dbConfig.dbname"),
	multipleStatements	: config.get("dbConfig.multipleStatements")
})

// module.exports = pool
module.exports = pool.promise()