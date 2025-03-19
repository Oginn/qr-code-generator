import express from 'express';
import inquirer from 'inquirer';
import qr from 'qr-image';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'index.html'));
});

app.post('/generate', (req, res) => {
    const url = req.body.url;
    const qr_svg = qr.image(url, { type: 'png' });
    const qrPath = 'qr_image.png';

    qr_svg.pipe(fs.createWriteStream(qrPath));
    fs.writeFile('data.txt', url, (err) => {
        if (err) {
            res.status(500).send('Error saving data');
        } else {
            res.send('QR Code Generated');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
