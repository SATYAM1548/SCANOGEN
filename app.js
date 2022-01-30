if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
var QRCode = require('qrcode');
var QrCode = require('qrcode-reader');
const multer = require('multer');
const { storage } = require('./cloudinary');
const upload = multer({ storage })
const Jimp = require("jimp");
const fs = require('fs');


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render("home");
});

app.get('/generate', (req, res) => {
    res.render("index");
})

app.get('/scan', (req, res) => {
    res.render("scan");
})

app.post('/new', upload.array('image'), (req, res) => {
    var Jimp = require("jimp");

    Jimp.read(req.files[0].path, function (err, image) {
        if (err) {
            console.error(err);
            // TODO handle error
        }
        var qr = new QrCode();
        qr.callback = function (err, value) {
            if (err) {
                console.error(err);
                // TODO handle error
            }
            const s = value.result;
            res.render("showSite", { s });
            console.log(value);
        };
        qr.decode(image.bitmap);
    });

})


app.post('/post', (req, res) => {
    const inputText = req.body.textInfo;
    // QRCode.toString(inputText, { type: 'terminal' }, function (err, url) {
    //     console.log(url)

    // })
    QRCode.toDataURL(inputText, function (err, url) {
        // console.log(url)
        res.render('showqr', { url });
    })
})

app.get('/scancam', (req, res) => {
    res.render("scancam");
})

port = 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
})



