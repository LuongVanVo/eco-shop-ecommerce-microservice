import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main() {
    const user1 = await prisma.user.create({
        data: {
            email: "luongvanvo29@gmail.com",
            password: "$2b$10$OFRkRYgIO9dcXQsdGhRfleFw9Pp5I57tXRfGparcrTvb.LJaCigSe",
            role: "USER",
            name: "Lương Văn Võ"
        }
    })

    console.log(`Created user with id: ${user1}`)
}

main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })