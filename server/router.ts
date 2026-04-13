import * as controllers from './controllers';
import { Request, Response, Application } from 'express';
import * as middleware from './middleware';

const router = (app: Application) => {

    //* Page routes
    app.get('/dashboard', middleware.secureConnect, middleware.requiresLogin, controllers.Dashboard.DashboardPage);

    app.get('/login', middleware.secureConnect, middleware.requiresLogout, controllers.Account.LoginPage);
    app.post('/login', middleware.secureConnect, middleware.requiresLogout, controllers.Account.login);

    app.post('/logout', middleware.secureConnect, middleware.requiresLogin, controllers.Account.logout);

    app.post('/signup', middleware.secureConnect, middleware.requiresLogout, controllers.Account.signup);

    app.get('/settings', middleware.secureConnect, middleware.requiresLogin, controllers.Settings.settingsPage);

    //* API routes
    app.get('/api/healthwidget', middleware.secureConnect, middleware.requiresLogin, controllers.Widget.HealthWidget);
    
    
    // Create new widget
    app.post('/api/widget', middleware.secureConnect, middleware.requiresLogin, controllers.Widget.createWidget);
    // Delete widget
    app.delete('/api/widget/:id', middleware.secureConnect, middleware.requiresLogin, controllers.Widget.deleteWidget);
    // Update a widget
    app.put('/api/widget/:id', middleware.secureConnect, middleware.requiresLogin, controllers.Widget.updateWidget);

    // Get requests dashboards
    app.get('/api/dashboard', middleware.secureConnect, middleware.requiresLogin, controllers.Dashboard.getDashboard);
    // Post new dashboards
    app.post('/api/dashboard', middleware.secureConnect, middleware.requiresLogin, controllers.Dashboard.createDashboard);
    // Delete dashboards
    app.delete('/api/dashboard/:id', middleware.secureConnect, middleware.requiresLogin, controllers.Dashboard.deleteDashboard);
    // Update dashboards
    app.put('/api/dashboard/:id', middleware.secureConnect, middleware.requiresLogin, controllers.Dashboard.updateDashboard);

    app.put('/api/settings', middleware.secureConnect, middleware.requiresLogin, controllers.Settings.updateSettings);

    //* Default route
    app.get('/', middleware.secureConnect, middleware.requiresLogout, controllers.Account.LoginPage);

    app.get('/*notFound', (req: Request, res: Response) => {
        res.status(404).render('notFound');
    });
};

export default router;