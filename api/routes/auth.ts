import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User.js';
import AppSettings from '../models/AppSettings.js';
import { AuthRequest } from '../types/express.js';

const router = express.Router();

// Middleware to verify token
const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req: AuthRequest, res: Response) => {
  const { username, password } = req.body;

  try {
    const settings = await AppSettings.findOne();
    if (!settings || !settings.signUpAllowed) {
      return res.status(403).json({ msg: 'Registration is currently closed' });
    }

    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ username, password });
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, username: user.username, settings: user.settings } });
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req: AuthRequest, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }) as IUser;
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user.id, username: user.username, settings: user.settings } });
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/me
// @desc    Get logged in user
// @access  Private
router.get('/me', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ msg: 'Authorized denied' });
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/auth/settings
// @desc    Update user settings
// @access  Private
router.put('/settings', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ msg: 'Authorized denied' });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const { allowance, startDate, currency } = req.body;
    
    if (allowance !== undefined) user.settings.allowance = allowance;
    if (startDate) user.settings.startDate = startDate;
    if (currency) user.settings.currency = currency;

    await user.save();

    res.json(user.settings);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/signup-status
// @desc    Check if registration is allowed
// @access  Public
router.get('/signup-status', async (_req: Request, res: Response) => {
  try {
    const settings = await AppSettings.findOne();
    res.json({ signUpAllowed: settings ? settings.signUpAllowed : false });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export { auth };
export default router;
