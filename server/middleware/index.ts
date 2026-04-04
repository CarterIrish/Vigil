import { Request, Response, NextFunction } from 'express';

export const requiresLogin = (req: Request, res: Response, next: NextFunction): void => {
    if(!req.session.account) {
        return res.redirect('/');
    }
    return next();
}