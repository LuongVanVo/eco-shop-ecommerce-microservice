class profileUser {
    id: number
    userId: number
    address: string
    phone: string
    avatarUrl: string
    createdAt: Date
    updatedAt: Date

    constructor(id: number, userId: number, address: string, phone: string, avatarUrl: string, createdAt: Date, updatedAt: Date) {
        this.id = id
        this.userId = userId
        this.address = address
        this.phone = phone
        this.avatarUrl = avatarUrl
        this.createdAt = createdAt
        this.updatedAt = updatedAt  
    }
}

export const profileUserInstance = new profileUser(0, 0, '', '', '', new Date(), new Date())