import { Response } from 'express';
import mongoose from 'mongoose';
import { Teacher, ITeacher } from '../models';
import { User } from '../models';
import { asyncHandler, AppError, NotFoundError, BadRequestError, ForbiddenError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendEmail } from '../utils/email';

export const createTeacher = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const {
    userId,
    name,
    email,
    phone,
    password,
    employeeId,
    designation,
    department,
    qualification,
    experience,
    dateOfJoining,
    dateOfBirth,
    gender,
    bloodGroup,
    permanentAddress,
    temporaryAddress,
    emergencyContactName,
    emergencyContactRelation,
    emergencyContactPhone,
    assignedClasses,
    assignedSubjects,
  } = req.body;

  let user;
  if (userId) {
    user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    if (user.role !== 'teacher') {
      user.role = 'teacher';
      await user.save();
    }
  } else {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email already registered');
    }
    user = await User.create({
      name,
      email,
      password: password || 'TempPass123!',
      phone,
      role: 'teacher',
    });
  }

  const existingTeacher = await Teacher.findOne({ employeeId });
  if (existingTeacher) {
    throw new BadRequestError('Employee ID already exists');
  }

  const teacher = await Teacher.create({
    user: user._id,
    employeeId: employeeId.toUpperCase(),
    designation,
    department,
    qualification,
    experience: experience || 0,
    dateOfJoining: new Date(dateOfJoining),
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
    gender,
    bloodGroup,
    address: {
      permanent: permanentAddress,
      temporary: temporaryAddress,
    },
    emergencyContact: {
      name: emergencyContactName,
      relationship: emergencyContactRelation,
      phone: emergencyContactPhone,
    },
    assignedClasses: assignedClasses || [],
    assignedSubjects: assignedSubjects || [],
    isApproved: false,
    status: 'active',
  });

  if (assignedClasses && assignedClasses.length > 0) {
    await Teacher.populate(teacher, { path: 'assignedClasses', select: 'name code' });
  }
  if (assignedSubjects && assignedSubjects.length > 0) {
    await Teacher.populate(teacher, { path: 'assignedSubjects', select: 'name code' });
  }

  res.status(201).json({
    success: true,
    message: 'Teacher created successfully. Awaiting admin approval.',
    data: { teacher },
  });
});

export const getTeachers = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 10, search, department, status, isApproved } = req.query;
  const query: any = {};

  if (search) {
    query.$or = [
      { employeeId: { $regex: search, $options: 'i' } },
      { designation: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } },
    ];
  }
  if (department) query.department = department;
  if (status) query.status = status;
  if (isApproved !== undefined) query.isApproved = isApproved === 'true';

  const teachers = await Teacher.find(query)
    .populate('user', 'name email phone avatar')
    .populate('assignedClasses', 'name code grade section')
    .populate('assignedSubjects', 'name code')
    .populate('approvedBy', 'name')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Teacher.countDocuments(query);

  res.json({
    success: true,
    data: {
      teachers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getTeacher = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const teacher = await Teacher.findById(req.params.id)
    .populate('user', 'name email phone avatar')
    .populate('assignedClasses', 'name code grade section')
    .populate('assignedSubjects', 'name code class')
    .populate('approvedBy', 'name')
    .populate({
      path: 'assignedClasses',
      populate: { path: 'classTeacher', select: 'employeeId' },
    });

  if (!teacher) {
    throw new NotFoundError('Teacher not found');
  }

  res.json({
    success: true,
    data: { teacher },
  });
});

export const updateTeacher = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const teacher = await Teacher.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  )
    .populate('user', 'name email phone avatar')
    .populate('assignedClasses', 'name code grade section')
    .populate('assignedSubjects', 'name code');

  if (!teacher) {
    throw new NotFoundError('Teacher not found');
  }

  res.json({
    success: true,
    message: 'Teacher updated successfully',
    data: { teacher },
  });
});

export const approveTeacher = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) {
    throw new NotFoundError('Teacher not found');
  }

  if (teacher.isApproved) {
    throw new BadRequestError('Teacher already approved');
  }

  teacher.isApproved = true;
  teacher.status = 'active';
  teacher.approvedBy = req.userId as any;
  teacher.approvedAt = new Date();
  await teacher.save();

  const user = await User.findById(teacher.user);
  if (user) {
    try {
      await sendEmail({
        to: user.email,
        subject: 'Teacher Account Approved - Seven Star School',
        html: `
          <h2>Welcome to Seven Star School!</h2>
          <p>Your teacher account has been approved.</p>
          <p><strong>Employee ID:</strong> ${teacher.employeeId}</p>
          <p><strong>Designation:</strong> ${teacher.designation}</p>
          <p><strong>Department:</strong> ${teacher.department}</p>
          <p>You can now login and access your dashboard.</p>
        `,
      });
    } catch (emailError) {
      console.error('Teacher approved, but approval email failed:', emailError);
    }
  }

  res.json({
    success: true,
    message: 'Teacher approved successfully',
    data: { teacher },
  });
});

export const assignClassSubject = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { classIds, subjectIds } = req.body;

  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) {
    throw new NotFoundError('Teacher not found');
  }

  if (classIds) {
    teacher.assignedClasses = classIds;
  }
  if (subjectIds) {
    teacher.assignedSubjects = subjectIds;
  }

  await teacher.save();
  await teacher.populate('assignedClasses', 'name code grade section');
  await teacher.populate('assignedSubjects', 'name code class');

  res.json({
    success: true,
    message: 'Classes and subjects assigned successfully',
    data: { teacher },
  });
});

export const deleteTeacher = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const teacher = await Teacher.findByIdAndDelete(req.params.id);
  if (!teacher) {
    throw new NotFoundError('Teacher not found');
  }

  await User.findByIdAndUpdate(teacher.user, { role: 'student' });

  res.json({
    success: true,
    message: 'Teacher deleted successfully',
  });
});

export const getMyProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const teacher = await Teacher.findOne({ user: req.userId })
    .populate('user', 'name email phone avatar')
    .populate('assignedClasses', 'name code grade section')
    .populate('assignedSubjects', 'name code class');

  if (!teacher) {
    throw new NotFoundError('Teacher profile not found');
  }

  res.json({
    success: true,
    data: { teacher },
  });
});

export const getTeacherStats = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const teacher = await Teacher.findOne({ user: req.userId });
  if (!teacher) {
    throw new NotFoundError('Teacher profile not found');
  }

  const [classCount, subjectCount] = await Promise.all([
    Teacher.countDocuments({ assignedClasses: { $in: teacher.assignedClasses } }),
    Teacher.countDocuments({ assignedSubjects: { $in: teacher.assignedSubjects } }),
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        assignedClasses: teacher.assignedClasses.length,
        assignedSubjects: teacher.assignedSubjects.length,
        experience: teacher.experience,
        isApproved: teacher.isApproved,
        status: teacher.status,
      },
    },
  });
});