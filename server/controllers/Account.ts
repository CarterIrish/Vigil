import { Request, Response } from 'express';
import Account, { IAccount } from '../models/Account';

interface MongoError extends Error {
    code?: number;
}

export const LoginPage = (req: Request, res: Response) => {
    res.render('login');
}

export const settingsPage = (req: Request, res: Response) => {
    res.render('settings');
}

export const login = (req: Request, res: Response) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;

    if (!username || !pass) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    return Account.authenticate(username, pass, (err?: Error | null, account?: IAccount) => {
        if (err || !account) {
            return res.status(400).json({ error: 'Incorrect username or password' });
        }

        req.session.account = Account.toAPI(account);
        return res.json({ redirect: '/dashboard' });
    });
}

export const logout = (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to log out' });
        }
        return res.redirect('/login');
    });
}

export const signup = async (req: Request, res: Response) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;
    const pass2 = `${req.body.pass2}`;

    if (!username || !pass || !pass2) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (pass !== pass2) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const hash = await Account.generateHash(pass);
        const newAccount = new Account({ username, password: hash });
        await newAccount.save();
        req.session.account = Account.toAPI(newAccount);
        return res.json({ redirect: '/dashboard' });
    }
    catch (err: unknown) {
        console.log(err);
        if ((err as MongoError).code === 11000) {
            return res.status(400).json({ error: 'Username already in use' });
        }
        return res.status(400).json({ error: 'An error occurred' });
    }
};

