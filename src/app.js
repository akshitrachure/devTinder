const express = require('express')

const app = express()


app.use('/test',(req,res)=>{
    res.end("Hello from server 5000")
})

app.use('/',(req,res)=>{
    res.end("Hello from server")
})


app.listen(5000,()=>{
    console.log("Server listening on port 5000");    
})