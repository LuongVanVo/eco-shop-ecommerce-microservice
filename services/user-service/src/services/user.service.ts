import { uploadImageHelper } from "../helpers/uploadImageCloudinary"
import { BadRequestError } from "../../../../shared/core/error.response"
import { prisma } from "../../../../config/database.config"
import { getInfoData } from "../utils/getInfoData"
class UserService {

    // upload profile
    static uploadProfile = async (profileUserInstance: any) => {
        if (!profileUserInstance) throw new BadRequestError('No profile data provided')
        
            if (!profileUserInstance.userId) {
                throw new BadRequestError('User ID is required')
            }

        const imageUrl = await uploadImageHelper(profileUserInstance.avatarUrl)
        if (!imageUrl) throw new BadRequestError('Image upload failed')
        
        const newProfile = await prisma.profile.upsert({
            where: { userId: profileUserInstance.userId },
            update: {
                address: profileUserInstance.address,
                phone: profileUserInstance.phone,
                avatarUrl: imageUrl
            },
            create: {
                userId: profileUserInstance.userId,
                address: profileUserInstance.address,
                phone: profileUserInstance.phone,
                avatarUrl: imageUrl
            }
        })

        if (!newProfile) throw new BadRequestError('Error creating profile')

        return getInfoData(['id', 'userId', 'address', 'phone', 'avatarUrl', 'createdAt', 'updatedAt'], newProfile)
    }
}

export default UserService