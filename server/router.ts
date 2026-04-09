import * as controllers from './controllers';
import { Request, Response, Application } from 'express';
import * as middleware from './middleware';

const router = (app: Application) => {
    
    app.get('/dashboard', middleware.secureConnect, middleware.requiresLogin, controllers.Dashboard.DashboardPage);

    app.get('/login', middleware.secureConnect, middleware.requiresLogout, controllers.Account.LoginPage);

    app.get('/settings', middleware.secureConnect, middleware.requiresLogin,controllers.Account.settingsPage);

    app.get('/', middleware.secureConnect, middleware.requiresLogout, controllers.Account.LoginPage);

    app.get('/*notFound', (req: Request, res: Response) => {
        res.status(404).render('notFound');
    });
};

export default router;