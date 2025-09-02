import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger";
import { NotFoundRequestError } from '../../../../shared/core/error.response';

import dotenv from 'dotenv';

dotenv.config()

class Database {
    private static instance: PrismaClient

    // init connect
    public static init(): PrismaClient {
        if (!Database.instance) {
            if (!process.env.DATABASE_URL) {
                throw new NotFoundRequestError('DATABASE_URL is not valid !! Please check again in .env')
            }

            try {
                Database.instance = new PrismaClient({
                    datasources: {
                        db: {
                            url: process.env.DATABASE_URL
                        }
                    }
                })

                Database.instance.$connect()
                    .then(() => logger.info('Database connected successfully'))
                    .catch((err) => {
                        logger.error('Database connection failed ', err)
                        throw err
                    })
            } catch (error : any) {
               logger.error(`Failed to initialize database: ${error}`)
               throw error
            }
        }
        return Database.instance
    }

    // disconnected
    public static async close(): Promise<void> {
        if (Database.instance) {
            await Database.instance.$disconnect()
                .then(() => logger.info('Database disconnected !!!'))
                .catch((error) => {
                    logger.error('Failed to disconnect database:', error)
                })
        }
    }
}

export const prisma = Database.init()