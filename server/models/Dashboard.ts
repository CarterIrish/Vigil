import mongoose from 'mongoose';

export interface IDashboard extends mongoose.Document {
    owner: mongoose.Types.ObjectId;
    name: string;
    widgets: mongoose.Types.ObjectId[];
}

export interface IDashboardModel extends mongoose.Model<IDashboard> {
    toAPI(doc: IDashboard): { name: string; widgets: mongoose.Types.ObjectId[] };
}

const DashboardSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    widgets: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Widget'
    }]
});

DashboardSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    widgets: doc.widgets
});

DashboardSchema.index({ owner: 1, name: 1}, {unique: true});



const DashboardModel = mongoose.model('Dashboard', DashboardSchema);
export default DashboardModel;