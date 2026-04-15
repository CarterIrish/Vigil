import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

export interface IAccount extends mongoose.Document {
    username: string;
    password: string;
    subscriptionTier: 'free' | 'pro';
    createdAt: Date;
    validatePassword(password: string): Promise<boolean | string>;
}

export interface IAccountModel extends mongoose.Model<IAccount> {
    generateHash(password: string): Promise<string>;
    authenticate(username: string, password: string, callback: (err?: Error | null, doc?: IAccount) => void): Promise<void>;
    toAPI(doc: IAccount): { username: string; subscriptionTier: string; _id: mongoose.Types.ObjectId };
    validatePassword(document: IAccount, password: string): Promise<boolean | string>;
}

const saltRounds = 10;

let AccountModel: IAccountModel;

const AccountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        match: /^[A-Za-z0-9_\-.]{1,16}$/
    },
    password: {
        type: String,
        required: true
    },
    subscriptionTier: {
        type: String,
        enum: ['free', 'pro'],
        default: 'free'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

AccountSchema.statics.toAPI = (doc: IAccount) => ({
    username: doc.username,
    subscriptionTier: doc.subscriptionTier,
    _id: doc._id
});



AccountSchema.statics.generateHash = (password:string) => bcrypt.hash(password, saltRounds);
AccountSchema.statics.authenticate = async (username:string, password:string, callback: (err?: Error | null, doc?: IAccount) => void) => {
    try {
        const doc = await AccountModel.findOne({ username }).exec();
        if (!doc) {
            return callback();
        }
        const match = await bcrypt.compare(password, doc.password);
        if (match) {
            return callback(null, doc);
        }
        return callback();
    } catch (err) {
        return callback(err instanceof Error ? err : new Error('Unknown error'));
    }
};

AccountSchema.methods.validatePassword = async function (password: string): Promise<boolean | string> {
    try{
        const match = await bcrypt.compare(password, this.password);
        return match;
    }
    catch(err: unknown){
        return err instanceof Error ? err.message : 'Unknown error';
    }
}

AccountModel = mongoose.model<IAccount, IAccountModel>('Account', AccountSchema);
export default AccountModel;