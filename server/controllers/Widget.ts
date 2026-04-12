import { Request, Response } from 'express';
import WidgetModel from '../models/Widget';
import ServerHealthWidgetModel from '../models/ServerHealthWidget';
import DashboardModel from '../models/Dashboard';
//* Controllers for generic widget operations

export const createWidget = async (req: Request, res: Response) => {
    if (!req.session || !req.session.account) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!req.body.type || !req.body.name) {
        return res.status(400).json({ error: 'Widget type and name are required' });
    }

    if (!req.body.dashboardId) {
        return res.status(400).json({ error: 'Dashboard ID is required to associate widget' });
    }

    const baseData = {
        name: req.body.name,
        type: req.body.type,
        owner: req.session.account._id
    };

    switch (baseData.type) {
        case 'ServerHealth': {
            if (!req.body.endpoint) {
                return res.status(400).json({ error: 'Endpoint is required for ServerHealth widget' });
            }
            try {
                const widgetData = { ...baseData, endpoint: req.body.endpoint };
                const dashboard = await DashboardModel.findOne({
                    _id: req.body.dashboardId,
                    owner: req.session.account._id
                });
                if (!dashboard) {
                    return res.status(404).json({ error: 'Dashboard not found' });
                }

                const newWidget = new ServerHealthWidgetModel(widgetData);
                await newWidget.save();
                await DashboardModel.findOneAndUpdate(
                    { _id: req.body.dashboardId, owner: req.session.account._id },
                    { $push: { widgets: newWidget._id } },
                );
                return res.status(201).json({
                    name: newWidget.name,
                    type: newWidget.type,
                    endpoint: newWidget.endpoint,
                    id: newWidget._id,
                    dashboardId: req.body.dashboardId
                });
            }
            catch{
                return res.status(500).json({ error: 'Failed to create widget' });
            }
        }
        default: return res.status(400).json({ error: 'Invalid widget type' });
    };
};

export const deleteWidget = async (req: Request, res: Response) => {
    if (!req.session || !req.session.account) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!req.params.id) {
        return res.status(400).json({ error: 'Widget ID is required' });
    }
    if (!req.query.dashboardId) {
        return res.status(400).json({ error: 'Dashboard ID is required to disassociate widget' });
    }
    try {
        const doc = await DashboardModel.findOneAndUpdate(
            { _id: req.query.dashboardId, owner: req.session.account._id },
            { $pull: { widgets: req.params.id } },
        );
        if (!doc) {
            return res.status(404).json({ error: 'Widget not found in dashboard' });
        }
        const result = await WidgetModel.deleteOne({
            _id: req.params.id,
            owner: req.session.account._id
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Widget not found or not owned by user' });
        }

        return res.status(200).json({ message: 'Widget deleted successfully' });
    } catch {
        return res.status(500).json({ error: 'Failed to delete widget' });
    }
};

export const updateWidget = async (_req: Request, _res: Response) => {
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
    } catch {
        return res.status(500).json({ error: 'Failed to fetch health data' });
    }

}