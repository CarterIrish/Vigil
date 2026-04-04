import { Request, Response } from 'express';

export const loginPage = (req: Request, res: Response): void => {
    res.render('login');
};