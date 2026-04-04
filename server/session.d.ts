import 'express-session';

declare module 'express-session' {
    interface SessionData {
        account: {
            username: string;
            _id: string;
        }
    }
}