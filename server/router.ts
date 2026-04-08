import {Application} from 'express';
import * as controllers from './controllers';
import { Request, Response } from 'express';

const router = (app: Application) => {
    
    app.get('/dashboard', controllers.Dashboard.DashboardPage);
    app.get('/login', controllers.Account.LoginPage);
    app.get('/settings', controllers.Account.settingsPage);
    app.get('/', controllers.Account.LoginPage);
    app.get('*', (req: Request, res: Response) => {
        res.status(404).render('404');
    });
};

export default router;