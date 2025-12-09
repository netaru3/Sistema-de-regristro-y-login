import express from 'express'
import {log} from './mongo.js'

let app= express()
app.use(express.urlencoded({ extended: true }))
app.get('/',function(req,res){ 
    res.sendFile("registro1.html",{
        root: import.meta.dirname
    })
})

app.get('/data',function(req,res){
       try{ if(req.body)
       {
        log.create({
        usuario: req.body.usuario,
        contraseña: req.body.contraseña
       })}} catch(error){
    console.log("error:",error)
   };
    res.sendFile("login.html",{
        root: import.meta.dirname
    })
    
})

app.post('/data',function(req,res){
       try{log.create({
        usuario: req.body.usuario,
        contraseña: req.body.contraseña
       })} catch(error){
    console.log("error:",error)
   };
    res.sendFile("login.html",{
        root: import.meta.dirname
    })
    
})

app.post('/data/logeado',async function(req,res){
    let cuenta=await log.find({usuario:req.body.usuario,
        contraseña:req.body.contraseña
    })
    console.log(cuenta);
    if(cuenta.length>0){res.send("sesión iniciada")
    }
else{res.send("Contraseña incorrecta")}
    
})

app.listen(3000)