const express = require('express')
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const uuid = require('uuid')

const app = express()
app.use(express.json())

app.post('/', (req, res) => {
    if (req.body) {
        const { name, quant, date } = req.body
        const person = {
            id: uuid.v4(),
            name,
            quant,
            date
        }
        run(person)
        res.status(200).send('ok')
    } else {
        res.status(404);
    }
})

const run = async (person) => {
    const pdfDoc = await PDFDocument.load(fs.readFileSync(`${__dirname}/assets/tree_certificate_clean_0419.pdf`));

    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()

    firstPage.drawText(person.name, {
        x: 48,
        y: 400,
        size: 30,
    })

    firstPage.drawText(person.name, {
        x: 300,
        y: 172,
        size: 10,
    })

    firstPage.drawText(person.quant, {
        x: 160,
        y: height / 2 + 5,
        size: 10,
    })

    firstPage.drawText(person.date, {
        x: 85,
        y: 55,
        size: 10,
    })

    const pdfBytes = await pdfDoc.save();
    const newFilePath = `${__dirname}/assets/certificado${person.id}.pdf`;
    fs.writeFileSync(newFilePath, pdfBytes);

}

app.listen(3000, () => {
    console.log('runn')
})