import mongoose from 'mongoose';
import WidgetModel from './Widget';
import { IWidget } from './Widget';

export interface IGameDealsWidget extends IWidget {
    storeID: string;
    maxPrice: number;
}

const GameDealsWidgetSchema = new mongoose.Schema({
    // CheapShark storeID (1 = Steam). Defaulted so the widget needs no config to create.
    storeID: {
        type: String,
        required: true,
        default: '1',
    },
    maxPrice: {
        type: Number,
        required: true,
        default: 15,
        min: 0,
    },
})

const GameDealsWidgetModel = WidgetModel.discriminator('GameDeals', GameDealsWidgetSchema);
export default GameDealsWidgetModel;
