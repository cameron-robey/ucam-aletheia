import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';

const app = express();
dotenv.config();

// Controllers
import { getCrsid } from './controllers/crsid';

// Routes
app.get('/crsid/:crsid', getCrsid);

// Set up server
const port: Number = parseInt(process.env.PORT || '7000');
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});