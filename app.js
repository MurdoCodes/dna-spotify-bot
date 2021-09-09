const cors = require(`cors`)
const express = require(`express`)
const session = require(`express-session`)
const bodyParser = require(`body-parser`)

const config = require(`config`)
const db = require('./utils/dbConnect')

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
app.get(`/`, (req, res) => {
    if(req.session.user){
        res.send({
            LoggedIn: true,
            user: req.session.user
        })
    }else{
        res.send({
            LoggedIn: false
        })
    }
})
app.get(`/logout`, (req, res) => {
    req.session.destroy()
    res.clearCookie('userId')
    res.send({ msg: 'logging you out' })
})
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


