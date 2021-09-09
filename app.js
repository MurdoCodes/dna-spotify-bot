const cors = require(`cors`)
const express = require(`express`)
const bodyParser = require(`body-parser`);

const config = require(`config`)
const db = require('./utils/dbConnect')

// Create express app
const app = express()

// Register Middleware
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Routes
app.use('/api/spotify/users', require('./src/Routes/usersRoute') ) // Users Route
app.use('/api/spotify/login', require('./src/Routes/loginRoute') ) // Users Route
app.use('/api/spotify/process', require('./src/Routes/processRoute') ) // Login Route

// Error Handling
app.use(( req, res ) => {
    res.status(404).render('404', { title: '404' })
})

// Port declaration and listening
const PORT = config.get("port")
app.listen(PORT, () => console.log(`Listening to port ${PORT}`) )


