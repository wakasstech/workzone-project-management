const auth = require('./Middlewares/auth.js');
const dotenv=require('dotenv');
const cors = require('cors');
const express = require('express');
const unless = require('express-unless');
const {Sequelize} = require('sequelize');
const bodyParser = require("body-parser");
const session = require("express-session");
const langdetect = require('langdetect');
const {  i18n,setLanguage } = require('./utils/multiLang');
const path =require('path');
const app = express()
app.use(cors()); 
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({ type: 'application/json' }));
app.use(
  session({
    secret: "dfsf94835asda",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json({ limit: '150mb' }));
 dotenv.config({path:'./config.env'});
 app.use(cors());
 app.use(i18n.init); 

 app.use("/Images", express.static("Images"));
const userRoute = require("./routes/userRouter.js");
 const workspaceRoute = require("./routes/workspaceRoute.js");
 const boardRoute = require('./routes/boardRoute');
 const listRoute = require('./routes/listRoute');
 const cardRoute = require('./routes/cardRoute');

// middleware
app.use('/api/user', userRoute);
 app.use('/api/workspace',workspaceRoute);
 app.use('/api/board', boardRoute);
 app.use('/api/list', listRoute);
 app.use('/api/card', cardRoute);


app.listen(process.env.PORT,()=>{
  console.log(`Server is running ${process.env.PORT}`);
});
module.exports = { app };






