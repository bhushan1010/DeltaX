import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  private authService = new AuthService();

  register = async (req: Request, res: Response) => {
    try {
      const { email, password, fullName, role } = req.body;

      // Basic validation
      if (!email || !password || !fullName || !role) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const user = await this.authService.register(email, password, fullName, role);

      // Generate tokens
      const accessToken = this.authService.generateToken(user);
      const refreshToken = this.authService.generateRefreshToken(user);

      // Remove password hash from response
      const { password_hash, ...userWithoutPassword } = user;

      return res.status(201).json({
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      if (error.message === 'User with this email already exists') {
        return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await this.authService.validateUser(email, password);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate tokens
      const accessToken = this.authService.generateToken(user);
      const refreshToken = this.authService.generateRefreshToken(user);

      // Update last login
      user.last_login = new Date();
      await this.authService.userRepository.save(user);

      // Remove password hash from response
      const { password_hash, ...userWithoutPassword } = user;

      return res.status(200).json({
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  refresh = async (req: Request, res: Response) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' });
      }

      let payload: any;
      try {
        payload = this.authService.verifyRefreshToken(refreshToken);
      } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired refresh token' });
      }

      // Get user from db
      const user = await this.authService.userRepository.findOneBy({ id: payload.id });
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      // Generate new access token
      const accessToken = this.authService.generateToken(user);
      // Optionally generate new refresh token (rotation)
      const newRefreshToken = this.authService.generateRefreshToken(user);

      return res.status(200).json({
        accessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };

  me = async (req: Request, res: Response) => {
    try {
      // The auth middleware should have attached the user to req
      // @ts-ignore
      const userId = req.user.id;

      const user = await this.authService.userRepository.findOneBy({ id: userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Remove password hash
      const { password_hash, ...userWithoutPassword } = user;

      return res.status(200).json({ user: userWithoutPassword });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}