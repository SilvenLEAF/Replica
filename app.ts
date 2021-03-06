import express, { NextFunction, Request, Response } from 'express';
import path from 'path';

import passport from 'passport';
import cookieSession from 'cookie-session';



// load environmental vars
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}



// -------------------firing express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, `client/build`)));


// cookie and passport
app.use(cookieSession({
  maxAge: 24*60*60*1000,
  keys: [`orehasaikyounizettainaru`],
}));
app.use(passport.initialize());
app.use(passport.session());







/* ----------------------------------------
.                 config
---------------------------------------- */
import './config/dbConfig';
import './config/passportConfig';








/* ----------------------------------------
.                 ROUTES
---------------------------------------- */
import authRoute from './routes/authRoute';
app.use(authRoute);

app.get('/', (req: Request, res: Response, next: NextFunction)=>{
  console.log(req.url);
  return res.json({ message: `Welcome to homepage!` })
});

// catch-all handler
app.get('*', (req: Request, res: Response, next: NextFunction)=>{
  return res.status(404).json({ message: `The URL you requested is NOT found!` })
});

// error handler
app.use(({ err, req, res } : { err: any, req: Request, res: Response, next: NextFunction })=>{
  console.error(err);
  return res.status(500).json({ error: true, message: err.message || `Server error!` })
});


// --------------------listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
  console.log(`Server running on PORT ${ PORT }`);
})