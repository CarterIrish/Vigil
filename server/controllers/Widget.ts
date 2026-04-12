import { Request, Response } from 'express';
import ServerHealthWidgetModel from '../models/ServerHealthWidget';
//* Controllers for generic widget operations

export const createWidget = async (req: Request, res: Response) => {
    // TODO: Implementation for creating a new widget
    if(!req.body.type || !req.body.name) {
        return res.status(400).json({error: 'Widget type and name are required'});
    }

    if(!req.session || !req.session.account) {
        return res.status(401).json({error: 'Unauthorized'});
    }

    const baseData = {
        name: req.body.name,
        type: req.body.type,
        owner: req.session.account._id
    };

    switch(baseData.type) {
        case 'ServerHealth':{
            if(!req.body.endpoint){
                return res.status(400).json({error: 'Endpoint is required for ServerHealth widget'});
            }
            try{
            const widgetData = {...baseData, endpoint: req.body.endpoint};
            const newWidget = new ServerHealthWidgetModel(widgetData);
            await newWidget.save();
            return res.status(201).json({name: newWidget.name, type: newWidget.type, endpoint: newWidget.endpoint});}
            catch(err: Error | unknown){
                return res.status(500).json({error: 'Failed to create widget'});
            }
        }
        default: return res.status(400).json({error: 'Invalid widget type'});
    };
};

export const deleteWidget = async (req: Request, res: Response) => {
    // TODO: Implementation for deleting a widget
};

export const updateWidget = async (req: Request, res: Response) => {
    // TODO: Implementation for updating a widget
};

//* Custom Widget Controllers
export const HealthWidget = async (req: Request, res: Response) => {
    if (typeof req.query.endpoint !== 'string') {
        return res.status(400).json({ error: 'Invalid endpoint' });
    }
    try {
        const healthResponse = await fetch(req.query.endpoint);
        const healthData = await healthResponse.json();
        res.status(200).json(healthData);
    } catch (err: Error | unknown) {
        return res.status(500).json({ error: 'Failed to fetch health data' });
    }

}