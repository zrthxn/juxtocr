const express = require('express')
const path = require('path')
const fs = require('fs')
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
server.listen(PORT, ()=>{
    console.log("OCR View Server Started ::", PORT)
})

server.get('/', (req,res)=>{
    res.sendFile( path.resolve(__dirname, 'views', 'index.html'))
})

server.post('/recognize', (req,res)=>{
    ContentDelivery.Upload(req.files.fileupload)
        .then((fileRef)=>{
            Tesseract.recognize(__dirname + '/storage/' + fileRef)
                .then((result)=>{
                    console.log(result)
                    res.json({ ref: fileRef, text: result.text })
                })
        }).catch((err)=>{
            console.log(err)
            res.status(403).send(err)
        })
})