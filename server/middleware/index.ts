import { Request, Response, NextFunction } from 'express';


export const requiresSecure = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(`https://${req.hostname}${req.url}`);
    }
    return next();
};

export const bypassSecure = (req: Request, res: Response, next: NextFunction) => {
    next();
}

export const requiresLogin = (req: Request, res: Response, next: NextFunction) => {
    if(!req.session.account){
        return res.redirect('/login');
    }
    return next();
}

export const requiresLogout = (req: Request, res: Response, next: NextFunction) => {
    if (req.session.account) {
        return res.redirect('/dashboard');
    }
    return next();
}

export const secureConnect = process.env.NODE_ENV === 'production' ? requiresSecure : bypassSecure;