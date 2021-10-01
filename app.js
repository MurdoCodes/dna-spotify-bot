const cors = require(`cors`)
const express = require(`express`)
const bodyParser = require(`body-parser`)
const jwt = require(`jsonwebtoken`)

const config = require(`config`)
const scheduler = require(`./scheduler`)
const helper = require(`./src/Helpers/helper`)
const authenticateToken = helper.authenticateToken

// Create express app
const app = express()

// Register Middleware
app.use(cors({
    origin: "*",
    method: "GET,POST,PUT,DELETE",
    credentials: true
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())

// Routes
app.get(`/`, authenticateToken, (req, res) => { // Default Page
    res.send({
        LoggedIn: true,
        user:req.user
    })
})
app.get(`/logout`, authenticateToken, (req, res) => { // Logout    
    res.cookie(`auth_token`, '', {maxAge: 1})
    res.cookie(`auth._token_expiration.local`, '', {maxAge: 1})
    res.cookie(`auth.strategy`, '', {maxAge: 1})    
    res.status(200).json({message: `User Logged out!`, status: true})
})

app.use('/api/users', require('./src/Routes/usersRoute') ) // App Users Route
app.use('/api/spotify/users', require('./src/Routes/spotifyRoute')) // Spotify Users Route
app.use(`/api/spotify/task`, require('./src/Routes/taskRoute')) // Task Route

app.use('/api/spotify/process', require('./src/Routes/processRoute') ) // Spotify Login/Process task Route


// Error Handling
app.use(( req, res ) => {
    res.status(404).render('404', { title: '404' })
})

// Cron Jobs
scheduler.intiCron(config.cronConfig)

// Port declaration and listening
const PORT = config.get("port")
app.listen(PORT, () => console.log(`Listening to port ${PORT}`) )


