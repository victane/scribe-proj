const express = require('express');
const path = require('path');
const app = express()
let bodyParser = require('body-parser')


app.use(express.static('./public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/', (req, res) => {
    console.log('user ativty home');
    res.sendFile(path.resolve(__dirname, './public/index.html'))
})

app.get('/dash', (req, res) => {
    console.log('user ativty for about');
    res.sendFile(path.resolve(__dirname, './public/dash.html'))

})
app.post('/dash', (req, res) => {
    const reqBody = req.body
    console.log(`posting user activity`);
    console.info(reqBody);
    // res.send(reqBody)
    res.sendFile(path.resolve(__dirname, './public/dash.html'))

})

app.get('*', (req, res) => {

    console.log('user ativty');
    res.status(404).send(`<h1> resource not found</h1>`)
})


app.listen(5000, () => {
    console.log(`server listening at 5000`);
})

