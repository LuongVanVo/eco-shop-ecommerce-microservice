import express, { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(morgan('combined'));
app.use(helmet());

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

app.use('/api/v1/auth', createProxyMiddleware({
  target: process.env.PATH_TO_USER_SERVICE,
  changeOrigin: true,
  pathRewrite: (path: string, req: Request) => path,
}))

app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});