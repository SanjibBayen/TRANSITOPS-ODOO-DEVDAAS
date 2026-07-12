import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { asyncHandler } from '../../utils/asyncHandler';

export class AuthController {
    private service = new AuthService();

    signup = asyncHandler(async (req: Request, res: Response) => {
        const result = await this.service.signup(req.body);
        res.status(201).json({ success: true, data: result });
    });

    login = asyncHandler(async (req: Request, res: Response) => {
        const result = await this.service.login(req.body);
        res.json({ success: true, data: result });
    });

    logout = asyncHandler(async (req: Request, res: Response) => {
        await this.service.logout(req.user!.id);
        res.json({ success: true, message: 'Logged out successfully' });
    });

    getMe = asyncHandler(async (req: Request, res: Response) => {
        const user = await this.service.getMe(req.user!.id);
        res.json({ success: true, data: user });
    });

    refreshToken = asyncHandler(async (req: Request, res: Response) => {
        const result = await this.service.refreshToken(req.body.refreshToken);
        res.json({ success: true, data: result });
    });
}