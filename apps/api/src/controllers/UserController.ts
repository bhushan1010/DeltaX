import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { User, UserRole } from '../entity/User';

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userRepository.find({
        select: ['id', 'email', 'full_name', 'role', 'is_active', 'created_at', 'last_login']
      });
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id as string);
      const user = await this.userRepository.findOne({
        where: { id: userId },
        select: ['id', 'email', 'full_name', 'role', 'is_active', 'created_at']
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  };

updateUserRole = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id as string);
      const role = req.body.role;

      if (!role || !(role === 'admin' || role === 'member')) {
        return res.status(400).json({ error: 'Valid role is required (admin, member)' });
      }

      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.role = role as UserRole;
      await this.userRepository.save(user);

      return res.status(200).json({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  };

toggleUserStatus = async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id as string);
      const is_active = req.body.is_active as boolean | undefined;

      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.is_active = is_active !== undefined ? is_active : !user.is_active;
      await this.userRepository.save(user);

      return res.status(200).json({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        is_active: user.is_active
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  };
}