import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, AVATAR_PRESETS } from '../db.js';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'cineverse_super_secret_jwt_key_2025';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  let token = req.cookies?.cineverse_token;
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session token' });
  }
}

// Register
authRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = db.createUser({ email, passwordHash, name });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('cineverse_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        membershipPlan: user.membershipPlan,
        profiles: user.profiles
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// Login
authRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('cineverse_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        membershipPlan: user.membershipPlan,
        profiles: user.profiles
      }
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// Quick 1-click Demo Login
authRouter.post('/demo-login', async (req: Request, res: Response) => {
  const user = db.findUserByEmail('sana@cineverse.io');
  if (!user) {
    return res.status(404).json({ error: 'Demo user not found' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('cineverse_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res.json({
    message: 'Demo login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      membershipPlan: user.membershipPlan,
      profiles: user.profiles
    }
  });
});

// Logout
authRouter.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('cineverse_token');
  return res.json({ message: 'Logged out successfully' });
});

// Me (Current user session)
authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = db.findUserById(req.userId!);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      membershipPlan: user.membershipPlan,
      createdAt: user.createdAt,
      profiles: user.profiles
    }
  });
});

// Forgot Password - Generates a 6-digit simulation verification code
authRouter.post('/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = db.findUserByEmail(email);
  if (!user) {
    // Return positive feedback for security, but allow testing
    return res.json({
      message: 'If the email exists, a password reset code has been sent.',
      devOtp: '749215'
    });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  db.updateUser(user.id, {
    resetToken: code,
    resetExpires: Date.now() + 15 * 60 * 1000 // 15 mins
  });

  return res.json({
    message: 'Verification code sent to your email.',
    devOtp: code // Exposed for easy testing in the prototype UI
  });
});

// Reset Password
authRouter.post('/reset-password', async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: 'Email, code, and new password are required' });
  }

  const user = db.findUserByEmail(email);
  if (!user || user.resetToken !== code || !user.resetExpires || user.resetExpires < Date.now()) {
    return res.status(400).json({ error: 'Invalid or expired verification code' });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  db.updateUser(user.id, {
    passwordHash,
    resetToken: null,
    resetExpires: null
  });

  return res.json({ message: 'Password reset successfully. You can now log in.' });
});

// Update Account Details
authRouter.put('/account', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { name, email, currentPassword, newPassword } = req.body;
  const user = db.findUserById(req.userId!);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const updates: Partial<typeof user> = {};

  if (name) updates.name = name;
  if (email && email !== user.email) {
    const existing = db.findUserByEmail(email);
    if (existing && existing.id !== user.id) {
      return res.status(409).json({ error: 'Email is already in use by another account' });
    }
    updates.email = email;
  }

  if (newPassword) {
    if (!currentPassword) {
      return res.status(400).json({ error: 'Current password is required to change password' });
    }
    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }
    updates.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  const updated = db.updateUser(user.id, updates);
  return res.json({
    message: 'Account updated successfully',
    user: {
      id: updated!.id,
      email: updated!.email,
      name: updated!.name,
      membershipPlan: updated!.membershipPlan,
      profiles: updated!.profiles
    }
  });
});

// Avatar presets
authRouter.get('/avatars', (req: Request, res: Response) => {
  return res.json({ avatars: AVATAR_PRESETS });
});
