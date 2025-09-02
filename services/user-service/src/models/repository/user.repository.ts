import { prisma } from '../../config/database.config'

class UserRepository {
    
    async findEmailExist(email: string) {
        return await prisma.user.findFirst({
            where: {
                email: email
            }
        })
    }
}

export default new UserRepository()