import {Request, Response} from 'express';

export const dashboardPage = (req: Request, res: Response): void => {
    res.render('app');
}