import mongoose from "mongoose";
import WidgetModel from "./Widget";

const ServerHealthWidgetSchema = new mongoose.Schema({
    endpoint: {
        type: String,
        required: true,
        trim:true
    }
});

const ServerHealthWidgetModel = WidgetModel.discriminator('ServerHealth', ServerHealthWidgetSchema);
export default ServerHealthWidgetModel;