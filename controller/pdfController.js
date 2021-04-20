const fs = require('fs');
const { PDFDocument, StandardFonts, rgb  } = require('pdf-lib');
const uuid = require('uuid')
const path = require('path')

const run = async (person) => {
    const pdfDoc = await PDFDocument.load(
        fs.readFileSync(`${path.dirname(__dirname)}/assets/tree_certificate_clean_0419.pdf`));
    const pages = pdfDoc.getPages()
    const firstPage = pages[0]
    const { width, height } = firstPage.getSize()
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

    firstPage.drawText(person.name, {
        x: 48,
        y: 400,
        size: 35,
        font: timesRomanFont,
        color: rgb(1, 1, 1),    
    })

    firstPage.drawText(person.name, {
        x: 297,
        y: 172,
        size: 12,
        color: rgb(0.5, 0.5, 0.7),    
    })

    firstPage.drawText(person.quant, {
        x: 160,
        y: height / 2 + 5,
        size: 10,
        color: rgb(0.5, 0.5, 0.7),    
    })

    firstPage.drawText(person.date, {
        x: 85,
        y: 55,
        size: 10,
        color: rgb(0.5, 0.5, 0.7),    
    })

    const pdfBytes = await pdfDoc.save();
    const newFilePath = `${path.dirname(__dirname)}/assets/certificado${person.id}.pdf`;
    fs.writeFileSync(newFilePath, pdfBytes);
}

const modify = (req, res) => {
    if (req.body) {
        const { name, quant } = req.body
        const date = new Date()
        const parseDate = `${date.getDate()}/${date.getMonth() +1}/${date.getFullYear()}`

        const person = {
            id: uuid.v4(),
            name,
            quant,
            date: parseDate
        }

        run(person)
        res.status(200).send('pdf created')
    } else {
        res.status(404).send('algo falló');
    }
}

module.exports = modify