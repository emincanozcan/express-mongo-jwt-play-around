const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const authRequired = require('./middlewares/auth-required.js')
const app = express()

const dbURI = `mongodb://root:pass@localhost:27017/app?authSource=admin`;

app.use(express.json())

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on("error", (err) => { console.error(err) })
db.once("open", () => { console.log("DB started successfully") })

app.use("/api/auth", authRouter)
app.use('/api/user', authRequired, userRouter)

app.use('*', (req, res, next) => {
  res.json({ status: '404' })
})

app.listen(3000, () => console.log("Server started at 3000"));