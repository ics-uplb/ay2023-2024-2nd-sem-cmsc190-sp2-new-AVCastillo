import dotenv from'dotenv';
dotenv.config()
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser';

// require('dotenv').config()
import express from 'express'
import setUpRoutes from './routes.js'
import cors from 'cors'
import router from './routes.js';

const app = express()

//middlewares
// app.use(cors({
//     origin: '*',
//     credentials:true,
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type', 'Authorization',"Access-Control-Allow-Headers,","Access-Control-Allow-Methods","Origin","Accept"]
// }))

// // allow CORS



// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "https://castillo-sp2.vercel.app");
//     res.setHeader("Access-Control-Allow-Methods", "POST, GET ,OPTIONS");
//     res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers,Access-Control-Allow-Methods,Origin,Accept,Content-Type, Authorization");
//     res.setHeader("Access-Control-Allow-Credentials","true");
//     next();
//   });

const corsOptions = {
    // origin: ["https://uplbattedancetracker.vercel.app","https://uplbattedancetracker.vercel.app/","https://uplbattedancetracker.vercel.app//"],
    origin:["https://castillo-sp2.vercel.app","https://castillo-sp2.vercel.app/","https://uplb-arms.vercel.app","https://uplb-arms.vercel.app/", "http://localhost:3000","https://nominatim.openstreetmap.org/reverse"],
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS', "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));





// app.use(cors({
//     origin: ["https://uplbattedancetracker.vercel.app","https://uplbattedancetracker.vercel.app/","https://uplbattedancetracker.vercel.app//"],
//     methods: ['GET', 'POST'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
    
//     //     res.setHeader("Access-Control-Allow-Credentials","true");
//   }));

// app.options('*',cors())


app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next()
})

app.use('/',router)


        

const connectToMongo= async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected!")
       

        app.listen(process.env.PORT,()=>{
            console.log("Listening on port")
        })
    }catch(error){
        console.log(error)
    }
}
// mongoose.connect(
//     "mongodb://127.0.0.1:27017/CastilloSP",
//     { useNewUrlParser: true, useUnifiedTopology: true },
//     (err) => {
//       if (err) { console.log(err); }
//       else { console.log("Successfully connected to Mongo DB"); }
//     });
connectToMongo();
  









