// Interface cho JWT payload
export interface JWTPayload {
    userId: string;
    email: string;
    iat: number;
    exp: number;
}