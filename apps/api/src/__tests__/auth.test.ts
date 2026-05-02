import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret';

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

interface RefreshTokenPayload {
  id: string;
}

describe('Auth Service - Token Generation', () => {
  const mockUser = {
    id: '123',
    email: 'test@example.com',
    role: 'sales_agent' as const,
  };

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const payload = {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should contain correct payload in token', () => {
      const payload: TokenPayload = {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

      expect(decoded.id).toBe(mockUser.id);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.role).toBe(mockUser.role);
    });

    it('should expire after 15 minutes', () => {
      const payload: TokenPayload = {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
      const decoded = jwt.decode(token) as any;

      expect(decoded.exp - decoded.iat).toBe(15 * 60);
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const payload: RefreshTokenPayload = {
        id: mockUser.id,
      };

      const token = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should contain user id in refresh token', () => {
      const payload: RefreshTokenPayload = {
        id: mockUser.id,
      };

      const token = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;

      expect(decoded.id).toBe(mockUser.id);
    });

    it('should expire after 7 days', () => {
      const payload: RefreshTokenPayload = {
        id: mockUser.id,
      };

      const token = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
      const decoded = jwt.decode(token) as any;

      expect(decoded.exp - decoded.iat).toBe(7 * 24 * 60 * 60);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const payload: TokenPayload = {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
      const decoded = jwt.verify(token, JWT_SECRET);

      expect(decoded).toBeDefined();
    });

    it('should throw error for invalid token', () => {
      expect(() => {
        jwt.verify('invalid-token', JWT_SECRET);
      }).toThrow();
    });

    it('should throw error for expired token', () => {
      const payload: TokenPayload = {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '-1s' });

      expect(() => {
        jwt.verify(token, JWT_SECRET);
      }).toThrow();
    });
  });
});