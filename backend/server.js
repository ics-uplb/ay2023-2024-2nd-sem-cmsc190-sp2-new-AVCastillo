import dotenv from'dotenv';
dotenv.config()
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser';

// require('dotenv').config()
import express from 'express'
import setUpRoutes from './routes.js'

const app = express()

//middlewares

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next()
})

// allow CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://uplbattedancetracker.vercel.app/");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers,Access-Control-Allow-Methods,Origin,Accept,Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials","true");
    next();
  });



const connectToMongo= async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected!")
        setUpRoutes(app);

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
  









