import { Request, Response } from 'express';

export function errorHandler(err: Error, req: Request, res: Response) {
  console.error('An error occurred:', err);
  res.status(500).json({ error: 'Internal Server Error' });
}
