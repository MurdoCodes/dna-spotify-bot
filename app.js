const cors = require(`cors`)
const express = require(`express`)
const bodyParser = require(`body-parser`)

const config = require(`config`)
const scheduler = require(`./scheduler`)
const helper = require(`./src/Helpers/helper`)
const authenticateToken = helper.authenticateToken

// Create express app
const app = express()

// Register Middleware
app.use(cors({
    origin: "*",
    method: "GET, POST, PUT, DELETE",
    credentials: true
}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())

// Middleware
// Add headers before the routes are defined
// app.use(function (req, res, next) {
//     //Enabling CORS
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
//       next();
//     });

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

// Cron Jobs
// scheduler.tester(config.cronConfig)

// Port declaration and listening
const PORT = config.get("port")
app.listen(PORT, () => console.log(`Listening to port ${PORT}`) )


