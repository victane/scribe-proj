const express = require('express');
const path = require('path');
let bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express()

const TWO_HOURS = 1000 * 60 * 60 * 2;

const {
    port = 5000,
    SESS_LIFETIME = TWO_HOURS,
    NODE_ENV = 'DEVELOPMENT',
    SESS_NAME = 'SID',
    SESS_SECRET = 'shh!queit,it\'asecret!',
} = process.env
const IN_PROD = NODE_ENV === 'PRODUCTION'

app.use(express.static('./public'))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(cookieParser())

app.use(session({
    name: SESS_NAME,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD,
    }
}))

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/login')
    } else {
        next()
    }
}
// if authenticated proceed home
const redirectHome = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/dash')
    } else {
        next()
    }
}
// dabase for user
const users = [
    {
        id: 1,
        username: 'victor',
        email: 'sundayvictane@gmail.com',
        psssword: 'sunday'
    }
]

app.get('/', (req, res) => {
    console.log(req.session);
    console.log('user ativty home');
    res.sendFile(path.resolve(__dirname, './public/index.html'))
})

app.get('/dash', redirectLogin, (req, res) => {
    console.log('user ativty for dashboard');
    res.sendFile(path.resolve(__dirname, './public/dash.html'))

})
app.post('/dash', (req, res) => {
    const reqBody = req.body
    res.cookie
    console.log(`posting user activity`);
    console.info(reqBody);
    // res.send(reqBody)
    res.sendFile(path.resolve(__dirname, './public/dash.html'))
    // res.redirect('/dash')

}
)
// if the user is login it doesn't make sense to show them the login page
app.get('/login', redirectHome, (req, res) => {
    console.log(`login page`);
    res.sendFile(path.resolve(__dirname, './public/login.html'))
})

app.post('/login', redirectHome, (req, res) => {
    const { email, password } = req.body
    // find user the match the email and password on request
    if (email & password) {
        const user = users.find(
            user => user.email === email && user.password === password
        )
        if (user) {
            req.session.userId = user.id
            res.redirect('/dash')
        }
    }
    res.redirect('/login')
})

app.get('/signup', redirectHome, (req, res) => {
    console.log(`signup page`);
    res.sendFile(path.resolve(__dirname, './public/signup.html'))
})
app.post('/signup', redirectHome, (req, res) => {
    const { name, email, password } = req.body
    if (name && email && password) {
        const exists = users.some(
            user => user.email === email
        )
        if (!exists) {
            const user = {
                id: users.length + 1,
                username,
                email,
                password
            }
            users.push(user)
            req.session.userId = user.id
            return res.redirect('/dash')
        }
    }
    res.sendFile(path.resolve(__dirname, './public/signup.html'))
    console.log(`signup complete`);
})
app.post('/logout', redirectLogin, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.redirect('/dash')
        }

        res.clearCookie(SESS_NAME)
        res.redirect('/login')

    })
})




app.get('*', (req, res) => {

    console.log('user ativty');
    res.status(404).send(`<h1> resource not found</h1>`)
})


app.listen(port, () => {
    console.log(`server listening at localhost:${port}`);
})

