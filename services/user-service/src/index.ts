import express, { Request, Response } from 'express';
import { prisma } from './config/database.config';
import userRouter from './routes/user.routes'
import helmet from 'helmet';
import morgan from 'morgan';
import { validateRefreshTokenMiddleware } from './utils/authToken';

import dotenv from 'dotenv';
import { authAccessTokenMiddleware } from './middleware/authMiddleware';

dotenv.config();


const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet());
app.use(morgan('combined'));
app.use(express.json())
app.use((req, res, next) => {
  console.log(`User-service received: ${req.method} ${req.url}`);
  next();
});

app.use('/', userRouter)

app.get('/test-server', authAccessTokenMiddleware, (req, res) => {
  res.send('User Service is running')
})

app.listen(PORT, () => {
    console.log(`User Service running on port ${PORT}`)
})

// Close connect when app stopped
process.on('SIGTERM', async() => {
    await prisma.$disconnect()
    process.exit(0)
})

process.on('SIGINT', async () => {
    await prisma.$disconnect()
    process.exit(0)
})