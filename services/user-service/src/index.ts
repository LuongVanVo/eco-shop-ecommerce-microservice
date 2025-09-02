import express, { Request, Response } from 'express';
import { prisma } from './config/database.config';
import userRouter from './routes/user.routes'
import { validateRefreshTokenMiddleware } from './utils/authToken';

import dotenv from 'dotenv';

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use('/user', userRouter)

app.get('/', validateRefreshTokenMiddleware, (req: Request, res: Response) => {
    res.json({
        message: 'User Service is running',
    });
});

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