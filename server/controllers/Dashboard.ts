import { Request, Response } from 'express';

export const DashboardPage = (req: Request, res: Response) => {
    res.render('dashboard');
}

export const HealthWidget = async (req: Request, res: Response) => {
    if(typeof req.query.endpoint !== 'string') {
        return res.status(400).json({ error: 'Invalid endpoint' });
    }
    const healthResponse = await fetch(req.query.endpoint);
    const healthData = await healthResponse.json();
    res.status(200).json(healthData); 
}