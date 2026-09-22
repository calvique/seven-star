import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User, IUser, Teacher } from '../models';
import { asyncHandler, AppError, BadRequestError, UnauthorizedError, NotFoundError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendEmail } from '../utils/email';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';

const generateAccessToken = (user: IUser): string => {
  return jwt.sign({ id: user._id.toString() }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
  });
};

const generateRefreshToken = (user: IUser): string => {
  return jwt.sign({ id: user._id.toString() }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn as jwt.SignOptions['expiresIn'],
  });
};

export const register = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email, password, phone, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new BadRequestError('Email already registered');
  }

  const accountRole = role || 'student';
  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: accountRole,
  });

  // Teacher self-registration creates a pending teacher profile. It cannot
  // access the teacher portal until an administrator approves it.
  if (accountRole === 'teacher') {
    const stamp = Date.now().toString().slice(-8);
    await Teacher.create({
      user: user._id,
      employeeId: `PENDING-${stamp}`,
      designation: 'Pending verification',
      department: 'Pending assignment',
      qualification: [],
      experience: 0,
      dateOfJoining: new Date(),
      gender: 'other',
      address: { permanent: 'To be updated by administration' },
      emergencyContact: { name: name, relationship: 'Self', phone: phone || 'Not provided' },
      assignedClasses: [],
      assignedSubjects: [],
      documents: { qualificationCertificates: [], experienceLetters: [], photo: '' },
      isApproved: false,
      status: 'inactive',
    });
    res.status(201).json({
      success: true,
      message: 'Teacher registration received. An administrator must approve the account before login.',
      data: {
        user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, avatar: user.avatar },
        accessToken: null,
        pendingApproval: true,
      },
    });
    return;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie('token', accessToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
    },
  });
});

export const login = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { email, password, rememberMe } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('Account is deactivated');
  }

  if (user.role === 'teacher') {
    const teacher = await Teacher.findOne({ user: user._id });
    if (!teacher || !teacher.isApproved || teacher.status !== 'active') {
      throw new UnauthorizedError('Teacher account is awaiting admin approval or activation');
    }
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid credentials');
  }

  user.lastLogin = new Date();
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const cookieOptions = {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: 'strict' as const,
    maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie('token', accessToken, cookieOptions);
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
    },
  });
});

export const logout = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (req.user) {
    req.user.refreshToken = undefined;
    await req.user.save({ validateBeforeSave: false });
  }

  res.clearCookie('token');
  res.clearCookie('refreshToken');

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export const refreshAccessToken = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!refreshToken) {
    throw new UnauthorizedError('Refresh token is required');
  }

  try {
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as { id: string };
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const accessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('token', accessToken, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Token refreshed',
      data: { accessToken },
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Refresh token expired, please login again');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid refresh token');
    }
    throw error;
  }
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    throw new UnauthorizedError('Not authenticated');
  }

  res.json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        avatar: req.user.avatar,
        isEmailVerified: req.user.isEmailVerified,
        lastLogin: req.user.lastLogin,
      },
    },
  });
});

export const forgotPassword = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.json({
      success: true,
      message: 'If the email exists, a reset link will be sent',
    });
    return;
  }

  const resetToken = jwt.sign({ id: user._id }, config.jwt.secret, { expiresIn: '1h' });
  
  const resetUrl = `${config.frontendUrl}/reset-password/${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Password Reset Request - Seven Star School',
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">Reset Password</a>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });

  res.json({
    success: true,
    message: 'If the email exists, a reset link will be sent',
  });
});

export const resetPassword = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { token, password } = req.body;

  let decoded: { id: string };
  try {
    decoded = jwt.verify(token, config.jwt.secret) as { id: string };
  } catch {
    throw new BadRequestError('Invalid or expired reset token');
  }

  const user = await User.findById(decoded.id).select('+password');
  if (!user) {
    throw new BadRequestError('Invalid reset token');
  }

  user.password = password;
  user.refreshToken = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successful',
  });
});

export const changePassword = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.userId).select('+password');
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new UnauthorizedError('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully',
  });
});

export const verifyEmail = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { token } = req.body;

  let decoded: { id: string };
  try {
    decoded = jwt.verify(token, config.jwt.secret) as { id: string };
  } catch {
    throw new BadRequestError('Invalid or expired verification token');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new BadRequestError('Invalid verification token');
  }

  if (user.isEmailVerified) {
    res.json({
      success: true,
      message: 'Email already verified',
    });
    return;
  }

  user.isEmailVerified = true;
  await user.save();

  res.json({
    success: true,
    message: 'Email verified successfully',
  });
});

export const resendVerification = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.json({
      success: true,
      message: 'If the email exists, a verification link will be sent',
    });
    return;
  }

  if (user.isEmailVerified) {
    res.json({
      success: true,
      message: 'Email already verified',
    });
    return;
  }

  const verificationToken = jwt.sign({ id: user._id }, config.jwt.secret, { expiresIn: '24h' });
  const verificationUrl = `${config.frontendUrl}/verify-email/${verificationToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Email Verification - Seven Star School',
    html: `
      <h2>Email Verification</h2>
      <p>Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `,
  });

  res.json({
    success: true,
    message: 'If the email exists, a verification link will be sent',
  });
});