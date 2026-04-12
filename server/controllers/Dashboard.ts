import { Request, Response } from 'express';
import DashboardModel from '../models/Dashboard';

export const DashboardPage = (req: Request, res: Response) => {
    res.render('dashboard');
}

//* Controllers for dashboard operations
export const getDashboard = async (req: Request, res: Response) => {
    // TODO: Implementation for fetching dashboard data
    if(!req.session || !req.session.account) {
        return res.status(401).json({error: 'Unauthorized'});
    }

    const userId = req.session.account._id;
    try{
        const dashboards = await DashboardModel.find({ owner: userId}).populate('widgets').exec();
        return res.status(200).json(dashboards);
    }
    catch(err: Error | unknown){
        return res.status(500).json({error: 'Failed to fetch dashboards'});
    }
};

export const createDashboard = async (req: Request, res: Response) => {
        if(!req.session || !req.session.account) {
        return res.status(401).json({error: 'Unauthorized'});
    }
    if(!req.body.name){
        return res.status(400).json({error: 'Dashboard name is required'});
    }

    const dashboardData = {
        name: req.body.name,
        owner: req.session.account._id,
        widgets: req.body.widgets || []
    };

    try{
        const newDashboard = new DashboardModel(dashboardData);
        await newDashboard.save();
        return res.status(201).json({name: newDashboard.name, id: newDashboard._id, widgets: newDashboard.widgets});
    }
    catch(err: Error | unknown){
        return res.status(500).json({error: 'Failed to create dashboard'});
    }
};  

export const deleteDashboard = async (req: Request, res: Response) => {
    // TODO: Implementation for deleting a dashboard
};

export const updateDashboard = async (req: Request, res: Response) => {
    // TODO: Implementation for updating a dashboard
};

