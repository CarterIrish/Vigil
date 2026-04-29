import mongoose from 'mongoose';

export interface IWidget extends mongoose.Document {
    type: string;
    name: string;
    owner: mongoose.Types.ObjectId;
    createdAt: Date;
    w: number;
    h: number;
}

export interface IWidgetModel extends mongoose.Model<IWidget> {
    toAPI(doc: IWidget): { name: string; type: string };
}

const WidgetSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['ServerHealth', 'Weather'],
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    w: {
        type: Number,
        default: 1,
        min: 1,
        max: 4
    },
    h: {
        type: Number,
        default: 1,
        min: 1,
        max: 4
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, { discriminatorKey: 'type' });

WidgetSchema.statics.toAPI = (doc: IWidget) => ({
    name: doc.name,
    type: doc.type,
});

let WidgetModel = mongoose.model('Widget', WidgetSchema);

export default WidgetModel;