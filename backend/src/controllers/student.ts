import { Response } from 'express';
import mongoose from 'mongoose';
import { Student } from '../models';
import { User } from '../models';
import { Class } from '../models';
import { asyncHandler, NotFoundError, BadRequestError, ConflictError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const createStudent = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const {
    userId,
    name,
    email,
    phone,
    password,
    admissionNumber,
    rollNumber,
    symbolNumber,
    classId,
    section,
    dateOfBirth,
    gender,
    bloodGroup,
    nationality,
    religion,
    motherTongue,
    fatherName,
    fatherOccupation,
    fatherPhone,
    motherName,
    motherOccupation,
    motherPhone,
    guardianName,
    guardianPhone,
    guardianRelation,
    permanentAddress,
    temporaryAddress,
    previousSchool,
    previousClass,
    academicYear,
  } = req.body;

  const classDoc = await Class.findById(classId);
  if (!classDoc) {
    throw new NotFoundError('Class not found');
  }

  if (classDoc.currentStrength >= classDoc.capacity) {
    throw new BadRequestError('Class is at full capacity');
  }

  let user;
  if (userId) {
    user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    if (user.role !== 'student') {
      user.role = 'student';
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
      role: 'student',
    });
  }

  const existingStudent = await Student.findOne({ admissionNumber: admissionNumber.toUpperCase() });
  if (existingStudent) {
    throw new ConflictError('Admission number already exists');
  }

  if (rollNumber) {
    const existingRoll = await Student.findOne({ rollNumber, class: classId, academicYear });
    if (existingRoll) {
      throw new ConflictError('Roll number already exists for this class and academic year');
    }
  }

  const student = await Student.create({
    user: user._id,
    admissionNumber: admissionNumber.toUpperCase(),
    rollNumber,
    symbolNumber: symbolNumber?.toUpperCase(),
    class: classId,
    section: section?.toUpperCase(),
    dateOfBirth: new Date(dateOfBirth),
    gender,
    bloodGroup,
    nationality: nationality || 'Nepali',
    religion,
    motherTongue,
    fatherName,
    fatherOccupation,
    fatherPhone,
    motherName,
    motherOccupation,
    motherPhone,
    guardianName,
    guardianPhone,
    guardianRelation,
    address: {
      permanent: permanentAddress,
      temporary: temporaryAddress,
    },
    previousSchool,
    previousClass,
    academicYear,
    status: 'active',
  });

  classDoc.currentStrength += 1;
  await classDoc.save();

  await student.populate('class', 'name code grade section');
  await student.populate('user', 'name email phone avatar');

  res.status(201).json({
    success: true,
    message: 'Student created successfully',
    data: { student },
  });
});

export const getStudents = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 10, search, class: classId, section, status, academicYear } = req.query;
  const query: any = {};

  if (search) {
    query.$or = [
      { admissionNumber: { $regex: search, $options: 'i' } },
      { rollNumber: { $regex: search, $options: 'i' } },
    ];
  }
  if (classId) query.class = classId;
  if (section) query.section = String(section).toUpperCase();
  if (status) query.status = status;
  if (academicYear) query.academicYear = academicYear;

  const students = await Student.find(query)
    .populate('user', 'name email phone avatar')
    .populate('class', 'name code grade section')
    .sort({ admissionNumber: 1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Student.countDocuments(query);

  res.json({
    success: true,
    data: {
      students,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getStudent = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const student = await Student.findById(req.params.id)
    .populate('user', 'name email phone avatar')
    .populate('class', 'name code grade section');

  if (!student) {
    throw new NotFoundError('Student not found');
  }

  res.json({
    success: true,
    data: { student },
  });
});

export const updateStudent = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { classId, rollNumber, ...updateData } = req.body;

  const student = await Student.findById(req.params.id);
  if (!student) {
    throw new NotFoundError('Student not found');
  }

  if (classId && classId !== student.class.toString()) {
    const newClass = await Class.findById(classId);
    if (!newClass) {
      throw new NotFoundError('New class not found');
    }
    if (newClass.currentStrength >= newClass.capacity) {
      throw new BadRequestError('New class is at full capacity');
    }

    const oldClass = await Class.findById(student.class);
    if (oldClass) {
      oldClass.currentStrength -= 1;
      await oldClass.save();
    }
    newClass.currentStrength += 1;
    await newClass.save();

    student.class = classId;
  }

  if (rollNumber && rollNumber !== student.rollNumber) {
    const existingRoll = await Student.findOne({ 
      rollNumber, 
      class: student.class, 
      academicYear: student.academicYear 
    });
    if (existingRoll) {
      throw new ConflictError('Roll number already exists for this class and academic year');
    }
    student.rollNumber = rollNumber;
  }

  Object.assign(student, updateData);
  await student.save();

  await student.populate('user', 'name email phone avatar');
  await student.populate('class', 'name code grade section');

  res.json({
    success: true,
    message: 'Student updated successfully',
    data: { student },
  });
});

export const promoteStudent = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { newClassId, newSection, newRollNumber, newAcademicYear } = req.body;

  const student = await Student.findById(req.params.id);
  if (!student) {
    throw new NotFoundError('Student not found');
  }

  const newClass = await Class.findById(newClassId);
  if (!newClass) {
    throw new NotFoundError('New class not found');
  }
  if (newClass.currentStrength >= newClass.capacity) {
    throw new BadRequestError('New class is at full capacity');
  }

  if (newRollNumber) {
    const existingRoll = await Student.findOne({ 
      rollNumber: newRollNumber, 
      class: newClassId, 
      academicYear: newAcademicYear 
    });
    if (existingRoll) {
      throw new ConflictError('Roll number already exists for this class and academic year');
    }
  }

  const oldClass = await Class.findById(student.class);
  if (oldClass) {
    oldClass.currentStrength -= 1;
    await oldClass.save();
  }
  newClass.currentStrength += 1;
  await newClass.save();

  student.class = newClassId;
  student.section = newSection?.toUpperCase();
  student.rollNumber = newRollNumber;
  student.academicYear = newAcademicYear;
  await student.save();

  await student.populate('user', 'name email phone avatar');
  await student.populate('class', 'name code grade section');

  res.json({
    success: true,
    message: 'Student promoted successfully',
    data: { student },
  });
});

export const deleteStudent = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) {
    throw new NotFoundError('Student not found');
  }

  const classDoc = await Class.findById(student.class);
  if (classDoc) {
    classDoc.currentStrength = Math.max(0, classDoc.currentStrength - 1);
    await classDoc.save();
  }

  await User.findByIdAndUpdate(student.user, { role: 'student' });

  res.json({
    success: true,
    message: 'Student deleted successfully',
  });
});

export const getMyProfile = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const student = await Student.findOne({ user: req.userId })
    .populate('user', 'name email phone avatar')
    .populate('class', 'name code grade section');

  if (!student) {
    throw new NotFoundError('Student profile not found');
  }

  res.json({
    success: true,
    data: { student },
  });
});