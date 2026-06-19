import { asyncHandler } from '../utils/asyncHandler.js';
import { forgotPasswordSchema, googleSchema, loginSchema, registerSchema, resetPasswordSchema } from '../validators/auth.js';
import * as AuthService from '../services/auth.service.js';
import { logActivity } from '../services/activity.service.js';

export const register = asyncHandler(async (req, res) => {
  const data = registerSchema.parse(req.body);
  const result = await AuthService.register(data.name, data.email, data.password);
  await logActivity(result.user.id, 'REGISTER', undefined, req.ip, req.headers['user-agent']);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req, res) => {
  const data = loginSchema.parse(req.body);
  const result = await AuthService.login(data.email, data.password);
  await logActivity(result.user.id, 'LOGIN', undefined, req.ip, req.headers['user-agent']);
  res.json(result);
});

export const google = asyncHandler(async (req, res) => {
  const data = googleSchema.parse(req.body);
  const result = await AuthService.googleLogin(data.credential);
  await logActivity(result.user.id, 'GOOGLE_LOGIN', undefined, req.ip, req.headers['user-agent']);
  res.json(result);
});

export const me = asyncHandler(async (req, res) => res.json({ user: req.user }));

export const forgotPassword = asyncHandler(async (req, res) => {
  const data = forgotPasswordSchema.parse(req.body);
  const token = await AuthService.createResetToken(data.email);
  const revealToken = process.env.NODE_ENV !== 'production';
  res.json({ message: 'If that email exists, a reset link has been generated.', resetToken: revealToken ? token : undefined });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const data = resetPasswordSchema.parse(req.body);
  await AuthService.resetPassword(data.token, data.password);
  res.json({ message: 'Password reset successful' });
});
