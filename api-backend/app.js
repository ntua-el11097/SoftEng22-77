const express = require('express')
const fs = require("fs")
const https = require("https")
const mongoose = require('mongoose')
const multer = require('multer')

const Questionnaire = require('./models/questionnaire')
const Answerraire = require('./models/answerraire')
const Answer = require('./models/answer')
const healthcheck = require("./healthcheck")
const questionnaire_upd = require('./questionnaire_upd')
const resetall = require('./resetall')
const resetq = require("./resetq")
const getquestionnaire = require("./getquestionnaire")
const getquestion = require("./getquestion")
const doanswer = require("./doanswer")

mongoose.set('strictQuery', true)
mongoose.connect('mongodb://localhost:27017/intelliq', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
})


const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(multer().array())

https.createServer(
    {
        key: fs.readFileSync("./server.key"),
        cert: fs.readFileSync("./server.cert"),
    },
    app
).listen(9103, () => {
    console.log('Serving on port 9103')
})


app.get('/', (req, res) => {
    res.send('home')
})


app.get('/intelliq_api/admin/healthcheck', (req, res) => {
    res.send(healthcheck(db))
})


app.post('/intelliq_api/admin/questionnaire_upd', async (req, res) => {
    const result = await questionnaire_upd(req)
    res.sendStatus(result)
})


app.post('/intelliq_api/admin/resetall', async (req, res) => {
    const result = await resetall()
    res.sendStatus(result)
})


app.post('/intelliq_api/admin/resetq/:questionnaireID', async (req, res) => {
    const result = await resetq(req.params.questionnaireID)
    res.sendStatus(result)
})


app.get('/intelliq_api/questionnaire/:questionnaireID', async (req, res) => {
    const result = await getquestionnaire(req.params.questionnaireID)
    res.send(result)
})


app.get('/intelliq_api/question/:questionnaireID/:questionID', async (req, res) => {
    const result = await getquestion(req.params)
    res.send(result)
})


app.post('/intelliq_api/doanswer/:questionnaireID/:questionID/:session/:optionID', async (req, res) => {
    const result = await doanswer(req.params)
    res.sendStatus(result)
})
