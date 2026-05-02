import { User } from '../entity/User';
import { AppDataSource } from '../config/ormconfig';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export class AuthService {
  userRepository = AppDataSource.getRepository(User);

  async register(email: string, password: string, fullName: string, role: string): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create and save user
    const user = this.userRepository.create({
      email,
      password_hash: passwordHash,
      full_name: fullName,
      role,
    });

    return await this.userRepository.save(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return null;
    }

    return user;
  }

  generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '15m' });
  }

  generateRefreshToken(user: User): string {
    const payload = {
      id: user.id,
    };

    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret', { expiresIn: '7d' });
  }

  verifyToken(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
  }

  verifyRefreshToken(token: string): any {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret');
  }
}