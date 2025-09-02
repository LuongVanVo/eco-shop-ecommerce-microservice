import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

export const createTokenPair = async (
    payload: {
        userId: string;
        email: string;
    } & JwtPayload,
    publicKey: string,
    privateKey: string,
): Promise<{ accessToken: string; refreshToken: string; }> => {
    try {
        const accessToken = await jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1d',
        })
        const refreshToken = await jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7d',
        })
        
        // Verify the token
        jwt.verify(accessToken, publicKey, { algorithms: ['RS256'] }, (err, decode) => {
            if (err) 
                throw new Error('Access token is invalid')
            
            console.log(`Access token is valid: ${JSON.stringify(decode, null, 2)}`);
        })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new Error('Failed to create token pair')
    }
}