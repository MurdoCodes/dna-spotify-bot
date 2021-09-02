
const cors = require(`cors`)
const config = require(`config`)
const express = require(`express`)
const app = express()

// Register Middleware
app.use(cors())

// Routes
app.use('/api/spotify/login', require('./src/Routes/loginRoute') )

// Error Handling
// app.use((req, res, next) => {
// 	const error = new Error('Not Found')
// 	error.status = 404
// 	next(error)
// })
// app.use((error, req, res, next) => {
// 	res.status(error.status || 500)
// 	res.json({
// 		error: {
// 			message: error.message
// 		}
// 	})
// })

// Port declaration and listening
const PORT = config.get("port")
app.listen(PORT, () => console.log(`Listening to port ${PORT}`) )


