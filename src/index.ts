import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { handleAuth } from './auth';

const app = express();
dotenv.config();

// Controllers
import { getCrsid } from './controllers/crsid';

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, API-Key')
  next()
});

// Routes
app.get('/crsid/:crsid', handleAuth, getCrsid);

// Set up server
const port: Number = parseInt(process.env.PORT || '7000');
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});