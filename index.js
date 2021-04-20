const express = require('express')
const modify = require('./controller/pdfController')

const app = express()
app.use(express.json())

app.post('/', modify)

app.listen(3000, () => {
    console.log('run forest, run')
})