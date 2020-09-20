import express, { Request, Response } from 'express';
const app = express();

// Controllers
import { getCrsid } from './controllers/crsid';

// Routes
app.get('/crsid/:crsid', getCrsid);

// Set up server
app.listen(7000, () => {
  console.log('Server started on port 7000');
});