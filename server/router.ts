import * as controllers from './controllers';
import { Request, Response, Application } from 'express';

const router = (app: Application) => {
    
    app.get('/dashboard', controllers.Dashboard.DashboardPage);
    app.get('/login', controllers.Account.LoginPage);
    app.get('/settings', controllers.Account.settingsPage);
    app.get('/', controllers.Account.LoginPage);
    app.get('*', (req: Request, res: Response) => {
        res.status(404).render('notFound');
    });
};

export default router;