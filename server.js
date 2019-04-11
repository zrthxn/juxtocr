const express = require('express')
const path = require('path')
const server = express()

const PORT = 25737

server.listen(PORT, ()=>{
    console.log("OCR View Server Started ::", PORT)
})

server.get('*', (req, res)=>{
    res.sendFile( path.resolve( __dirname, 'views', 'index.html'))
})