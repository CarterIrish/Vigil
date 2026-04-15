import { Request, Response } from 'express';
import Account from '../models/Account';

export const settingsPage = (req: Request, res: Response) => {
    res.render('settings');
}

const updatePassword = async (req: Request, res: Response) => {
    const sessionAccount = req.session.account;
    if (!sessionAccount) { return res.status(401).json({ error: 'Unauthorized' }); }

    const currentPass = `${req.body.currentPass}`;
    const newPass = `${req.body.newPass}`;
    const confirmPass = `${req.body.confirmPass}`;

    if (!currentPass || !newPass || !confirmPass) { return res.status(400).json({ error: 'All fields are required' }); }
    if (currentPass === newPass) { return res.status(400).json({ error: 'New password must be different from current password' }); }
    if (newPass !== confirmPass) { return res.status(400).json({ error: 'New password and confirmation do not match' }); }

    try {
        // Get the account doc from DB to access validation method
        const doc = await Account.findById(sessionAccount._id).exec();
        if (!doc) { return res.status(404).json({ error: 'Account not found' }); }

        // Validate the user's provided password against the stored hash
        const isMatch = await doc.validatePassword(currentPass);
        // Branch on validation result, if false return error, if true hash new password and save
        if (!isMatch) { return res.status(400).json({ error: 'Current password is incorrect'}); }
        
        const newPassHash = await Account.generateHash(newPass);
        doc.password = newPassHash;
        await doc.save();
        return res.status(200).json({ message: 'Password change successful' });

    } catch (err: unknown) {
        console.error('Error updating password:', err instanceof Error ? err.message : err);
        return res.status(500).json({ error: 'An error occurred while updating the password' });
    }

}

const updateSubscription = async (req: Request, res: Response) => {
    let sessionAccount;
    if (!(sessionAccount = req.session.account)) { return res.status(401).json({ error: 'Unauthorized' }); }

    const newTier = `${req.body.subscriptionTier}`;
    const isValidTier = (tier: string): tier is 'free' | 'pro' => tier === 'free' || tier === 'pro';
    if (!isValidTier(newTier)) { return res.status(400).json({ error: 'Invalid subscription tier' }); }

    try {
        const doc = await Account.findById(sessionAccount._id).exec();
        if (!doc) { return res.status(404).json({ error: 'Account not found' }); }

        doc.subscriptionTier = newTier;
        await doc.save();
        req.session.account.subscriptionTier = newTier; // Add tier to redis session
        return res.status(200).json({ message: 'Subscription tier updated successfully' });
    } catch (err: unknown) {
        console.error('Error updating subscription tier:', err instanceof Error ? err.message : err);
        return res.status(500).json({ error: 'An error occurred while updating the subscription tier' });
    }
}

export const updateSettings = (req: Request, res: Response) => {
    switch (req.body.type) {
        case ('passwordChange'): {
            updatePassword(req, res);
            break;
        }
        case ('subscriptionChange'): {
            updateSubscription(req, res);
            break;
        }
        default: {
            return res.status(400).json({ error: 'Invalid settings type' });
        }
    }
}
