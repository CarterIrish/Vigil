import { Request, Response } from 'express';
import WidgetModel from '../models/Widget';
import ServerHealthWidgetModel from '../models/ServerHealthWidget';
import ClockWidgetModel from '../models/ClockWidget';
import DashboardModel from '../models/Dashboard';
import { FREE_TIER_LIMITS } from '../config/accountLimits';
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

    if (req.session.account.subscriptionTier === 'free') {
        const count = await WidgetModel.countDocuments({ owner: req.session.account._id });
        if (count >= FREE_TIER_LIMITS.widgets) {
            return res.status(403).json({ error: 'Free tier is limited to 2 widgets. Upgrade to Pro for unlimited widgets.' });
        }
    }

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
            catch (err: unknown) {
                return res.status(500).json({ error: 'Failed to create widget', errorDetails: err instanceof Error ? err.message : 'Unknown error' });
            }
        }
        case 'Clock': {
            if (!req.body.timezone || !req.body.format) {
                return res.status(400).json({ error: 'Timezone and format are required for Clock widget' });
            }
            try {
                const widgetData = { ...baseData, timezone: req.body.timezone, format: req.body.format };
                const dashboard = await DashboardModel.findOne({
                    _id: req.body.dashboardId,
                    owner: req.session.account._id
                });
                if (!dashboard) {
                    return res.status(404).json({ error: 'Dashboard not found' });
                }
                const newWidget = new ClockWidgetModel(widgetData);
                await newWidget.save();
                await DashboardModel.findOneAndUpdate(
                    { _id: req.body.dashboardId, owner: req.session.account._id },
                    { $push: { widgets: newWidget._id } },
                );
                return res.status(201).json({
                    name: newWidget.name,
                    type: newWidget.type,
                    timezone: newWidget.timezone,
                    format: newWidget.format,
                    id: newWidget._id,
                    dashboardId: req.body.dashboardId
                });
            }
            catch (err: unknown) {
                return res.status(500).json({ error: 'Failed to create widget', errorDetails: err instanceof Error ? err.message : 'Unknown error' });
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
    } catch (err: unknown) {
        return res.status(500).json({ error: 'Failed to delete widget', errorDetails: err instanceof Error ? err.message : 'Unknown error' });
    }
};

export const updateWidget = async (req: Request, res: Response) => {
    if (!req.session || !req.session.account) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!req.params.id) {
        return res.status(400).json({ error: 'Widget ID is required' });
    }
    if (!req.body.name) {
        return res.status(400).json({ error: 'Widget name is required' });
    }

    const widget = await WidgetModel.findOne({ _id: req.params.id, owner: req.session.account._id });
    if (!widget) {
        return res.status(404).json({ error: 'Widget not found or not owned by user' });
    }

    const baseData = {
        name: req.body.name
    }
    try {
        switch (widget.type) {
            case 'ServerHealth': {
                if (!req.body.endpoint) {
                    return res.status(400).json({ error: 'Endpoint is required for ServerHealth widget' });
                }
                const updateData = { ...baseData, endpoint: req.body.endpoint };
                const doc = await ServerHealthWidgetModel.findOneAndUpdate(
                    { _id: req.params.id, owner: req.session.account._id },
                    updateData,
                    { returnDocument: 'after', runValidators: true }
                )
                if (!doc) {
                    return res.status(404).json({ error: 'Widget not found or not owned by user' });
                }
                return res.status(200).json({ name: doc.name, type: doc.type, endpoint: doc.endpoint, id: doc._id });
            }
            case 'Clock': {
                if (!req.body.timezone || !req.body.format) {
                    return res.status(400).json({ error: 'Timezone and format are required for Clock widget' });
                }
                const updateData = { ...baseData, timezone: req.body.timezone, format: req.body.format };
                const doc = await ClockWidgetModel.findOneAndUpdate(
                    { _id: req.params.id, owner: req.session.account._id },
                    updateData,
                    { returnDocument: 'after', runValidators: true }
                )
                if (!doc) {
                    return res.status(404).json({ error: 'Widget not found or not owned by user' });
                }
                return res.status(200).json({
                    name: doc.name,
                    type: doc.type,
                    timezone: doc.timezone,
                    format: doc.format,
                    id: doc._id
                });
            }
            default: return res.status(500).json({ error: 'Unknown widget type' });
        }
    } catch (err: unknown) {
        return res.status(500).json({ error: 'Failed to update widget', errorDetails: err instanceof Error ? err.message : 'Unknown error' });
    }
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
    } catch (err: unknown) {
        return res.status(500).json({ error: 'Failed to fetch health data', errorDetails: err instanceof Error ? err.message : 'Unknown error' });
    }

}