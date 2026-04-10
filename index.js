import express from 'express'
import {log} from './mongo.js'
import {createServer} from 'http'
import {Server} from 'socket.io'
import {rateLimit} from 'express-rate-limit'
import session from 'express-session'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()

let app= express()
const server= createServer(app)
const IO= new Server(server)

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // ventana de 15 minutos
    max: 10,                   // máximo 10 requests por ventana
    message: { error: 'Demasiados intentos, esperá 15 minutos' },
    standardHeaders: true,
    legacyHeaders: false,
})

app.use(limiter)
app.use(express.json())

app.use(express.urlencoded({ extended: true }))
let sesion=session({
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true
  }
});

app.use(sesion)
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
       return res.send("el usuario ya está tomado")};
      await  log.create({
        usuario: req.body.usuario,
        contraseña: bcrypt.hashSync(req.body.contraseña,10)
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

app.post('/data/logeado',async function(req,res){
    let cuenta=await log.find({usuario:req.body.usuario});
    if(cuenta.length===0){return res.send("error en el inicio de sesión")}

   let validacion= bcrypt.compareSync(req.body.contraseña,cuenta[0].contraseña); console.log(validacion)
    if(cuenta.length>0 && validacion===true ){req.session.usuario=cuenta[0].usuario;return res.send("ok");
    }
else{
     res.send("error en el inicio de sesión")
}})
    
app.get("/sesion",function(req,res){
    if(req.session.usuario===undefined){res.send("no tiene permiso de entrar acá")}
    res.sendFile("sesion.html",{
        root: import.meta.dirname
    })
})

IO.on("connection",function(socket){
    console.log("te conectaste")
    socket.on("error-sesion",function(){
      
        socket.emit("error","hubo un error en el inicio de sesion")
    })

    socket.on("disconnect",function(){

    })})

server.listen(process.env.PORT || 3000)

