import { Request, Response } from 'express';

export const DashboardPage = (req: Request, res: Response) => {
    res.render('dashboard');
}