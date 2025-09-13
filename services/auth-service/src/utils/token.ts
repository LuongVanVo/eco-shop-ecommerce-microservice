import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
dotenv.config()

console.log(process.env.JWT_SECRET);
console.log(process.env.ACCESS_TOKEN_EXPIRES)
// export function generateAccessToken(user: any) {
//     return jwt.sign({
//         userId : user.id,
//         email: user.email
//     }, process.env.JWT_SECRET as string, {
//         expiresIn: process.env.ACCESS_TOKEN_EXPIRES as string
//     })
// }