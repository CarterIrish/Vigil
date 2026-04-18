import { Request, Response } from 'express';
import DashboardModel from '../models/Dashboard';
import { FREE_TIER_LIMITS } from '../config/accountLimits';
import mongoose from 'mongoose';
import WidgetModel from '../models/Widget';
export const DashboardPage = (req: Request, res: Response) => {
    res.render('dashboard');
}

//* Controllers for dashboard operations
export const getDashboard = async (req: Request, res: Response) => {
    if (!req.session || !req.session.account) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.session.account._id;
    try {
        const dashboards = await DashboardModel.find({ owner: userId }).populate('widgets').exec();
        return res.status(200).json(dashboards);
    }
    catch (err: unknown) {
        return res.status(500).json({ error: 'Failed to fetch dashboards', errorDetails: err instanceof Error ? err.message : 'Unknown error' });
    }
};

export const createDashboard = async (req: Request, res: Response) => {
    if (!req.session || !req.session.account) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!req.body.name) {
        return res.status(400).json({ error: 'Dashboard name is required' });
    }

    if (req.session.account.subscriptionTier === 'free') {
        const count = await DashboardModel.countDocuments({ owner: req.session.account._id });
        if (count >= FREE_TIER_LIMITS.dashboards) {
            return res.status(403).json({ error: 'Free tier is limited to 1 dashboard. Upgrade to Pro for unlimited dashboards.' });
        }
    }

    const dashboardData = {
        name: req.body.name,
        owner: req.session.account._id,
        widgets: req.body.widgets || []
    };

    try {
        const newDashboard = new DashboardModel(dashboardData);
        await newDashboard.save();
        return res.status(201).json({ name: newDashboard.name, id: newDashboard._id, widgets: newDashboard.widgets });
    }
    catch (err: unknown) {
        return res.status(500).json({ error: 'Failed to create dashboard', errorDetails: err instanceof Error ? err.message : 'Unknown error' });
    }
};

export const deleteDashboard = async (req: Request, res: Response) => {
    console.log('Delete dashboard request received for ID:', req.params.id);
    if (!req.session || !req.session.account) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!req.params.id) {
        return res.status(400).json({ error: 'Dashboard ID is required' });
    }
    if (mongoose.isValidObjectId(req.params.id) === false) {
        return res.status(400).json({ error: 'Invalid Dashboard ID' });
    }
    const dashboard = await DashboardModel.findOne({ _id: req.params.id, owner: req.session.account._id });
    if (!dashboard) {
        return res.status(404).json({ error: 'Dashboard not found' });
    }

    const session = await mongoose.startSession();
    try {
        await session.withTransaction(async () => {
            await WidgetModel.deleteMany(
                { _id: { $in: dashboard.widgets }, owner: req.session.account!._id },
                { session }
            );
            await DashboardModel.deleteOne(
                { _id: req.params.id, owner: req.session.account!._id },
                { session }
            );
        });
        return res.status(200).json({ message: 'Dashboard deleted successfully' });
    }
    catch (err: unknown) {
        return res.status(500).json({ error: 'Failed to delete dashboard', errorDetails: err instanceof Error ? err.message : 'Unknown error' });
    }
    finally {
        await session.endSession();
    }
};

export const updateDashboard = async (req: Request, res: Response) => {
    if (!req.session || !req.session.account) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!req.params.id) {
        return res.status(400).json({ error: 'Dashboard ID is required' });
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ error: 'Invalid Dashboard ID' });
    }
    if (!req.body.name) {
        return res.status(400).json({ error: 'Dashboard name is required' });
    }

    const dashboard = await DashboardModel.findOne({ _id: req.params.id, owner: req.session.account._id });
    if (!dashboard) {
        return res.status(404).json({ error: 'Dashboard not found' });
    }

    try {
        const doc = await DashboardModel.findOneAndUpdate(
            { _id: req.params.id, owner: req.session.account._id },
            { name: req.body.name },
            { returnDocument: 'after', runValidators: true }
        );
        if (!doc) {
            return res.status(404).json({ error: 'Dashboard not found or not owned by user' });
        }
        return res.status(200).json({ name: doc.name, id: doc._id, widgets: doc.widgets });
    } catch (err: unknown) {
        if (err instanceof Error && 'code' in err && err.code === 11000) {
            return res.status(409).json({ error: 'Dashboard with this name already exists' });
        }
        return res.status(500).json({ error: 'Failed to update dashboard', errorDetails: err instanceof Error ? err.message : 'Unknown error' });
    }
};

