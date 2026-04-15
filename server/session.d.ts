import 'express-session';
import { Types } from 'mongoose';

declare module 'express-session' {
    interface SessionData {
        account?: {
            username: string;
            subscriptionTier: string;
            _id: Types.ObjectId;
        }
    }
}