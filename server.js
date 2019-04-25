const express = require('express')
const hbs = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const Tesseract = require('tesseract.js')
const ContentDelivery = require('./util/ContentDelivery')

const server = express()
const PORT = 25737

server.use(fileUpload())
server.use(cookieParser())
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.use( '/static', express.static(path.join(__dirname, 'static')) )
server.use( '/storage', express.static(path.join(__dirname, 'storage')) )
server.listen(PORT, ()=>{
    console.log("OCR View Server Started ::", PORT)
})

server.set('views', path.join(__dirname, 'views'))
server.set('view engine', 'hbs')
server.engine('hbs', hbs({
    defaultLayout: 'main',
    extname: 'hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: [
        __dirname + '/views/partials'
    ]
}))

server.get('/', (req,res)=>{
    res.render('index', {'title': 'JUXT OCR Server'})
})

server.post('/recognize', (req,res)=>{
    ContentDelivery.Upload(req.files.fileupload)
        .then((fileRef)=>{
            Tesseract.recognize(__dirname + '/storage/' + fileRef)
                .then((result)=>{
                    console.log(result)
                    res.render('index', {
                        'title': 'JUXT OCR Server',
                        'text': result.text,
                        'data': JSON.stringify({
                            'ref': fileRef
                        })
                    })
                })
        }).catch((err)=>{
            console.log(err)
            res.status(403).send(err)
        })
})