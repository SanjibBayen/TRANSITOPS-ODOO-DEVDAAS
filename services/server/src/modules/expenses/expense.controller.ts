import { Request, Response } from 'express';
import { ExpenseService } from './expense.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class ExpenseController {
    private service = new ExpenseService();

    getAll = asyncHandler(async (req: Request, res: Response) => {
        const expenses = await this.service.getAll(req.query as any);
        res.json({ success: true, data: expenses });
    });

    create = asyncHandler(async (req: Request, res: Response) => {
        const expense = await this.service.create(req.body);
        res.status(201).json({ success: true, data: expense });
    });
}