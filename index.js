import express from 'express'
import {log} from './mongo.js'
import {createServer} from 'http'
import {Server} from 'socket.io'

let app= express()
const server= createServer(app)
const IO= new Server(server)
app.use(express.json())

app.use(express.urlencoded({ extended: true }))
app.get('/',function(req,res){ 
    res.sendFile("registro1.html",{
        root: import.meta.dirname
    })
})

app.post('/data',async function(req,res){
       try{ if(req.body)
       { let cuenta=await log.find({usuario:req.body.usuario
    });
    console.log(cuenta);
    if(cuenta.length>0){res.setHeader("Content-Type", "text/plain");
       return res.send("el usuario ya está tomado")}
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

app.get('/data',async function(req,res){
      // try{ log.create({
       // usuario: req.body.usuario,
       // contraseña: req.body.contraseña
      // })} catch(error){
    //console.log("error:",error)
  // };
    res.sendFile("login.html",{
        root: import.meta.dirname
    })
    
})

app.post('/data/logeado',async function(req,res,next){
    let cuenta=await log.find({usuario:req.body.usuario,
        contraseña:req.body.contraseña
    })
    console.log(cuenta);
    if(cuenta.length>0){res.send("ok")
    }
else{
     res.send("error en el inicio de sesión")
}
    
app.get("/sesion",function(req,res){
    res.sendFile("sesion.html",{
        root: import.meta.dirname
    })
})
})
IO.on("connection",function(socket){
    console.log("te conectaste")
    socket.on("error-sesion",function(){
      
        socket.emit("error","hubo un error en el inicio de sesion")
    })

    socket.on("disconnect",function(){

    })})

server.listen(3000)

