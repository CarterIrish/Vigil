import 'express-session';
import { Types } from 'mongoose';

declare module 'express-session' {
    interface SessionData {
        account?: {
            username: string;
            _id: Types.ObjectId;
        }
    }
}