import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

interface IAccount extends mongoose.Document {
    username: string;
    password: string;
    createdAt: Date;
}

interface IAccountModel extends mongoose.Model<IAccount> {
    generateHash(password: string): Promise<string>;
    authenticate(username: string, password: string, callback: (err?: Error | null, doc?: IAccount) => void): Promise<void>;
    toAPI(doc: IAccount): { username: string; _id: mongoose.Types.ObjectId };
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

AccountSchema.statics.toAPI = (doc) => (
    {
        username: doc.username,
        _id: doc._id
    }
);

AccountModel = mongoose.model<IAccount, IAccountModel>('Account', AccountSchema);

AccountSchema.statics.generateHash = (password) => bcrypt.hash(password, saltRounds);
AccountSchema.statics.authenticate = async (username, password, callback) => {
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
        return callback(err);
    }
};

export default AccountModel;