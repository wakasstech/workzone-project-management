const auth = require('./MiddleWares/auth.js');
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
// Configure i18n for multi-language support
// Middleware to set locale based on user preference or request
//const {connectDB} = require("./db/index.js");

//const setupRoles = require('./MiddleWares/setupRoles.js');
//  Passing parameters separately (other dialects)  
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
//  i18n.configure({
//      locales: ['en', 'ur'],
//      directory: path.join(__dirname, '../locales/'),
//      defaultLocale: 'en',
//      updateFiles: false,
//      objectNotation: true,
//      autoReload: false, 
//      syncFiles: false,  
//    });

  
 app.use(i18n.init); 
  const translate = require('@vitalets/google-translate-api');

 translate('this is for testing purpose', {to: 'ro'}).then(res => {
     console.log(res.text);
     //=> I speak English
     console.log(res.from.language.iso);
     //=> nl
 }).catch(err => {
     console.error(err);
 });


 app.use("/Images", express.static("Images"));
 //routes
 const userRoute = require("./routes/userRouter.js");
 const workspaceRoute = require("./routes/workspaceRoute.js");
 //const bookRoute = require('./routes/bookRoute');
 //const authorRoute = require('./routes/authorRoute');
// middleware
app.use('/user', userRoute);

 app.use('/workspace',workspaceRoute);

 //app.use('/book', bookRoute);
// app.use('/author', authorRoute);
//previosly connected mongodb<................Now Converting To Sequelizing..............>
//  connectDB()
// .then(() => {

// app.listen(process.env.PORT || 9090, () => {
//   console.log(`⚙️ Server is running at port : ${process.env.PORT || 9090}`);
// });
// })
// .catch((err) => {
//     console.log("MONGO db connection failed !! ", err);
// })
//   app.listen(process.env.PORT,()=>{
//     console.log(" Server is running on port 5000");
// });
const fs = require('fs');
const pdfParse = require('pdf-parse');
const gtts = require('gtts');

// Function to convert PDF to text
async function convertPdfToText(pdfPath) {
  const pdfBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(pdfBuffer);
  return pdfData.text;
}

// Function to convert text to MP3
function convertTextToMp3(text, outputPath) {
  const speech = new gtts(text, 'en');
  return new Promise((resolve, reject) => {
    speech.save(outputPath, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

// Main function
async function pdfToMp3(pdfPath, mp3Path) {
  try {
    console.log('Extracting text from PDF...');
    const text = await convertPdfToText(pdfPath);
    console.log('Text extracted successfully.');

    console.log('Converting text to MP3...');
    await convertTextToMp3(text, mp3Path);
    console.log(`MP3 file saved at: ${mp3Path}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example usage
const pdfPath = './Controllers/benefits-of-cleaning-the-mouth.pdf'; // Replace with your PDF file path
const mp3Path = './Controllers/benefits-of-cleaning-the-mouth.mp3'; // Replace with your desired MP3 output path
pdfToMp3(pdfPath, mp3Path);

app.listen(process.env.PORT,()=>{
  console.log(`Server is running ${process.env.PORT}`);
});
console.log('i18n initialized in index:', i18n);
module.exports = { app };