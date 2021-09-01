
const cors = require(`cors`)
const config = require(`config`)
const express = require(`express`)
const app = express()

// Register Middlewares
app.use(cors())

// Routes
app.use('/api/spotify/login', require('./src/Routes/loginRoute') )

// Port declaration and listening
const PORT = config.get("port")
app.listen(PORT, () => console.log(`Listening to port ${PORT}`) )


