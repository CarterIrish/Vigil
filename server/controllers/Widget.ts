import { Request, Response } from 'express';

//* Controllers for generic widget operations

export const createWidget = async (req: Request, res: Response) => {
    // TODO: Implementation for creating a new widget
};

export const deleteWidget = async (req: Request, res: Response) => {
    // TODO: Implementation for deleting a widget
};

export const updateWidget = async (req: Request, res: Response) => {
    // TODO: Implementation for updating a widget
};

//* Custom Widget Controllers
export const HealthWidget = async (req: Request, res: Response) => {
    if (typeof req.query.endpoint !== 'string') {
        return res.status(400).json({ error: 'Invalid endpoint' });
    }
    try {
        const healthResponse = await fetch(req.query.endpoint);
        const healthData = await healthResponse.json();
        res.status(200).json(healthData);
    } catch (err: Error | unknown) {
        console.error('Error fetching health data:', err instanceof Error ? err.message : err);
        return res.status(500).json({ error: 'Failed to fetch health data' });
    }

}