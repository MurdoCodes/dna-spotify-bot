const mysql2 = require(`mysql2`)
const mysql = require(`mysql`)
const config = require(`config`)

const conn = mysql.createConnection({
	host				: config.dbConfig.host,
	port				: config.dbConfig.port,
	user				: config.dbConfig.user,
	password			: config.dbConfig.password,
	database			: config.dbConfig.database,
	dateStrings 		: config.dbConfig.dateStrings,
	multipleStatements	: config.dbConfig.multipleStatements,
})

conn.connect((err) => {
	if (err) {
	  throw err;
	}   
	console.log('Succesfully Connected to the database...');
})

module.exports = conn