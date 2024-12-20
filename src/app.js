const express = require('express')

const app = express()

app.use('/test',(req,res,next)=>{
    console.log("1st handler");
    // res.send("1st response");
    next();
},
(req,res,next)=>{
    console.log("2nd handler");
    // res.send("2nd response");
    next();
},
(req,res,next)=>{
    console.log("3rd handler");
    // res.send("3rd response");
    next();
},
(req,res,next)=>{
    console.log("4th handler");
    // res.send("4th response");
    next();
})



app.listen(5000,()=>{
    console.log("Server listening on port 5000");    
})































// //This will handle only GET call for /user
// app.get('/user',(req,res)=>{
//     res.send({firstName: 'Akshit', lastName: 'Rachure'});
// })


// //This will handle only POST call for /user
// app.post('/user',(req,res)=>{
//     res.send("Data saved to database");
// })


// // This will match routes /abc, /ac i.e. b is conditional
// app.get('/ab?c',(req,res)=>{
//     console.log("This will match routes /abc, /ac i.e. b is conditional");    
//     res.send({firstName: 'Akshit', lastName: 'Rachure'});
// })


// app.get('/a(bc)?d',(req,res)=>{
//     console.log("This will match routes /abc, /ac i.e. b is conditional");    
//     res.send({firstName: 'Akshit', lastName: 'Rachure'});
// })


// // This will match routes /abc, /abbc, /abbbbbc i.e. b is occurring one or more times
// app.get('/ab+c',(req,res)=>{
//     console.log("This will match routes /abc, /abbc, /abbbbbc i.e. b is occurring one or more times");
//     res.send({firstName: 'Akshit', lastName: 'Rachure'});
// })



// // * indicates any character (0 or more characters) i.e. /abc, /abAKSHITc
// app.get('/ab*c',(req,res)=>{
//     console.log("* indicates any character (0 or more characters) i.e. /abc, /abAKSHITc");
//     res.send({firstName: 'Akshit', lastName: 'Rachure'});
// })



// app.use('/test',(req,res)=>{
//     res.end("Hello from server 5000")
// })
