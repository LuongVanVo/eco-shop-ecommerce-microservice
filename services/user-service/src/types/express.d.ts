// Extend Request interface để TypeScript hiểu
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
                name: string | null;
                role: string;
            };
            token?: string;
        }
    }
}

export {}