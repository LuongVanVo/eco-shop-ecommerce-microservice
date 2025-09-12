import { v2 as cloudinary } from "cloudinary";
import { NotFoundRequestError } from "../../../../shared/core/error.response";
import dotenv from 'dotenv';
dotenv.config()

const requireEnvVariables = {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
}

// Kiểm tra xem các biến có thực sự tồn tại không
for (const [key, value] of Object.entries(requireEnvVariables)) {
    if (!value) {
        throw new NotFoundRequestError(`Missing required environment variables: ${key}`)
    }
}

cloudinary.config({
    cloud_name: requireEnvVariables.CLOUDINARY_CLOUD_NAME as string,
    api_key: requireEnvVariables.CLOUDINARY_API_KEY as string,
    api_secret: requireEnvVariables.CLOUDINARY_API_SECRET as string
})

export { cloudinary }