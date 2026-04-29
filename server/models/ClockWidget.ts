import mongoose from 'mongoose';
import WidgetModel from './Widget';
import { IWidget } from './Widget';

export interface IClockWidget extends IWidget {
    timezone: string;
    format: '12h' | '24h';
}

const ClockWidgetSchema = new mongoose.Schema({
    timezone: {
        type: String,
        required: true,
    },
    format: {
        type: String,
        required: true,
        default: '12h',
        enum: ['12h', '24h'],
    },
})

const ClockWidgetModel = WidgetModel.discriminator('Clock', ClockWidgetSchema);
export default ClockWidgetModel;