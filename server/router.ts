import { Application } from 'express';                                                                                    
import { Account, Dashboard } from './controllers';

const router = (app: Application) => {

    app.get('/dashboard', Dashboard.dashboardPage);

    app.get('/login', Account.loginPage);

    app.get('/', Account.loginPage);
}

export default router;