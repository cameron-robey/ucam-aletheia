import { Request, Response, NextFunction } from 'express';

export const handleAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.get('API-Key');
  if (!apiKey || apiKey !== process.env.API_KEY) {
    res.status(401).json({error: 'unauthorised'});
  } else {
    next();
  }
}