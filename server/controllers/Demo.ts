import { Request, Response } from 'express';

export const healthy = (_req: Request, res: Response) => {
    res.status(200).json({ status: 'healthy' });
};

export const unhealthy = (_req: Request, res: Response) => {
    res.status(200).json({ status: 'unhealthy' });
};

export const flaky = (_req: Request, res: Response) => {
    const status = Math.random() < 0.7 ? 'healthy' : 'unhealthy';
    res.status(200).json({ status });
};
