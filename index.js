const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const PORT = 7000;






app.post('/sum', (req, res) => {
    const { file, product } = req.body;
    console.log(`Received request to calculate sum for product: ${product} in file: ${file}`);
    if (!file || !product) {
        return res.status(400).json({ file: null, error: 'Invalid JSON input.' });
    }

    
    const filePath = "./MANSI_PV_dir/" + file;
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ file, error: 'File not found.' });
    }

    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            return res.status(500).json({ error: 'Error in file not read properly!!.' });
        }

        const lines = content.trim().split('\n'); 

        let sum = 0;
        let validCsv = true;
        let firstLine = true;
        let col = 0;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            const values = line.split(',').map(value => value.trim()); 

            if (firstLine && values.length !== 2) {
                validCsv = false;
                break;
            }

            if (firstLine) {
                col = values.length;
                firstLine = false;
            } else {
                if (values.length !== col) {
                    validCsv = false;
                    break;
                }
            }

            const [prod, amount] = values;
            if (prod === product) {
                const parsedAmount = parseInt(amount, 10);
                if (!isNaN(parsedAmount)) {
                    sum += parsedAmount;
                }
            }
        }

        if (!validCsv) {
            return res.status(400).json({ file, error: 'Input file not in CSV format.' });
        }
        
        return res.json({ file, sum });
    });
});

app.listen(PORT, () => {
    console.log(`Container2 listening on port ${PORT}`);
});
