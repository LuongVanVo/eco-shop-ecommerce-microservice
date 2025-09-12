import { cloudinary } from '../config/cloudinary.config';

export const uploadImageHelper = async (filePath: string) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: 'imageProfileUser', // lưu ảnh vào thư mục imageProfileUser, chỉ thêm vào đường dẫn
            resource_type: 'image' // loại tài nguyên là hình ảnh
        })

        console.log(`File path: ${filePath} uploaded to Cloudinary`)
        console.log(`Image uploaded to Cloudinary: ${uploadResult.secure_url}`)

        return uploadResult.secure_url // trả về url của ảnh đã tải lên
    } catch (err: any) {
        throw new Error(`Error uploading image to Cloudinary: ${err.message}`)
    }
}
