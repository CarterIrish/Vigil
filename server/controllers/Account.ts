import {Request, Response} from 'express';

export const LoginPage = (req: Request, res: Response) => {
    res.render('login');
}

export const settingsPage = (req: Request, res: Response) => {
    res.render('settings');
}