const cors = require(`cors`)
const express = require(`express`)
const session = require(`express-session`)
const bodyParser = require(`body-parser`)

const config = require(`config`)
const helper = require(`./src/Helpers/helper`)
const authenticateToken = helper.authenticateToken

// Create express app
const app = express()

// Register Middleware
app.use(cors({
    origin: "*",
    method: "GET, POST",
    credentials: true
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())

app.use(session({    
    key: "userId",
    secret: "DNA Spotify Bot",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24
    }
}))

// Routes
app.get(`/`, authenticateToken, (req, res) => { // Default Page
    res.send({
        LoggedIn: true,
        user:req.user
    })
})
app.get(`/logout`, (req, res) => { // Logout
    req.session.destroy()
    res.clearCookie('userId')
    res.send({ msg: 'logging you out' })
})
app.use('/api/users', require('./src/Routes/usersRoute') ) // App Users Route
app.use('/api/spotify/users', require('./src/Routes/spotifyRoute')) // Spotify Users Route
app.use(`/api/spotify/task`, require('./src/Routes/taskRoute')) // Task Route

app.use('/api/spotify/process', require('./src/Routes/processRoute') ) // Spotify Login/Process task Route

// Error Handling
app.use(( req, res ) => {
    res.status(404).render('404', { title: '404' })
})

// Port declaration and listening
const PORT = config.get("port")
app.listen(PORT, () => console.log(`Listening to port ${PORT}`) )


