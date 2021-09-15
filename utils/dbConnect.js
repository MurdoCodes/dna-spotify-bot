const mysql2 = require(`mysql2`)
const mysql = require(`mysql`)
const config = require(`config`)

// const pool = mysql2.createPool({
// 	host				: config.dbConfig.host,
// 	port				: config.dbConfig.port,
// 	user				: config.dbConfig.user,
// 	password			: config.dbConfig.password,
// 	database			: config.dbConfig.database,
// 	multipleStatements	: config.dbConfig.multipleStatements,
// 	waitForConnections: true,
// 	connectionLimit: 10,
// 	queueLimit: 0,
// })

// pool.getConnection((err, conn) => {
// 	if(err) {
// 		console.log(err)
// 	}else{
// 		console.log(`Connected to database : ` + conn.threadId);
// 	}
	
// });

// module.exports = pool.promise()


const conn = mysql.createConnection({
	host				: config.dbConfig.host,
	port				: config.dbConfig.port,
	user				: config.dbConfig.user,
	password			: config.dbConfig.password,
	database			: config.dbConfig.database,
	multipleStatements	: config.dbConfig.multipleStatements,
})

conn.connect((err) => {
	if (err) {
	  throw err;
	}   
	console.log('Succesfully Connected to the database...');
})

module.exports = conn