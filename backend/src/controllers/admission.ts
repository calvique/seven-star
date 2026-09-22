import { Response } from 'express';
import mongoose from 'mongoose';
import { Admission } from '../models';
import { Class } from '../models';
import { Student } from '../models';
import { User } from '../models';
import { asyncHandler, NotFoundError, BadRequestError, ConflictError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { sendEmail } from '../utils/email';

export const createAdmission = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const classDoc = await Class.findById(req.body.applyingForClassId);
  if (!classDoc) throw new NotFoundError('Class not found');

  const admissionNumber = `ADM${Date.now().toString(36).toUpperCase()}`;

  const admission = await Admission.create({
    academicYear: req.body.academicYear,
    applyingForClass: req.body.applyingForClassId,
    student: req.body.student,
    father: req.body.father,
    mother: req.body.mother,
    guardian: req.body.guardian,
    address: req.body.address,
    documents: req.body.documents || {},
    admissionNumber,
  });

  const notificationEmail = req.body.father.email || req.body.mother.email;
  if (notificationEmail) {
    try {
      await sendEmail({
        to: notificationEmail,
        subject: 'Admission Application Received - Seven Star School',
        html: `
          <h2>Admission Application Received</h2>
          <p>Thank you for applying to Seven Star English Boarding School.</p>
          <p><strong>Admission Number:</strong> ${admissionNumber}</p>
          <p><strong>Class Applied:</strong> ${classDoc.name}</p>
          <p><strong>Student:</strong> ${req.body.student.firstName} ${req.body.student.lastName}</p>
          <p>We will review your application and contact you soon.</p>
        `,
      });
    } catch (emailError) {
      console.error('Admission saved, but confirmation email failed:', emailError);
    }
  }

  res.status(201).json({
    success: true,
    message: 'Admission application submitted successfully',
    data: { admission },
  });
});

export const getAdmissions = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { page = 1, limit = 20, status, academicYear, applyingForClassId, search } = req.query;
  const query: any = {};

  if (status) query.status = status;
  if (academicYear) query.academicYear = academicYear;
  if (applyingForClassId) query.applyingForClass = applyingForClassId;
  if (search) {
    query.$or = [
      { admissionNumber: { $regex: search, $options: 'i' } },
      { 'student.firstName': { $regex: search, $options: 'i' } },
      { 'student.lastName': { $regex: search, $options: 'i' } },
      { 'father.name': { $regex: search, $options: 'i' } },
    ];
  }

  const admissions = await Admission.find(query)
    .populate('applyingForClass', 'name code grade')
    .populate('reviewedBy', 'name')
    .sort({ applicationDate: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Admission.countDocuments(query);

  res.json({
    success: true,
    data: {
      admissions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

export const getAdmission = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const admission = await Admission.findById(req.params.id)
    .populate('applyingForClass', 'name code grade')
    .populate('reviewedBy', 'name');

  if (!admission) throw new NotFoundError('Admission not found');

  res.json({
    success: true,
    data: { admission },
  });
});

export const updateAdmission = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { status, interviewDate, interviewNotes, admissionDate, rollNumber, notes } = req.body;

  const admission = await Admission.findById(req.params.id);
  if (!admission) throw new NotFoundError('Admission not found');

  if (status) admission.status = status;
  if (interviewDate) admission.interviewDate = new Date(interviewDate);
  if (interviewNotes) admission.interviewNotes = interviewNotes;
  if (admissionDate) admission.admissionDate = new Date(admissionDate);
  if (rollNumber) admission.rollNumber = rollNumber;
  if (notes) admission.notes = notes;

  admission.reviewedBy = new mongoose.Types.ObjectId(req.userId);
  admission.reviewedAt = new Date();

  if (status === 'accepted' && !admission.admissionDate) {
    admission.admissionDate = new Date();
  }

  await admission.save();

  if (status === 'accepted' || status === 'rejected') {
    const email = admission.father.email || admission.mother.email;
    if (email) {
      await sendEmail({
        to: email,
        subject: `Admission Application ${status === 'accepted' ? 'Accepted' : 'Rejected'} - Seven Star School`,
        html: `
          <h2>Admission Application ${status === 'accepted' ? 'Accepted' : 'Rejected'}</h2>
          <p>Dear ${admission.father.name},</p>
          <p>Your admission application for <strong>${admission.student.firstName} ${admission.student.lastName}</strong> has been <strong>${status}</strong>.</p>
          ${status === 'accepted' ? `
            <p><strong>Admission Number:</strong> ${admission.admissionNumber}</p>
            <p><strong>Roll Number:</strong> ${admission.rollNumber || 'Will be assigned'}</p>
            <p><strong>Class:</strong> ${admission.applyingForClass}</p>
            <p>Please visit the school office to complete the admission formalities.</p>
          ` : `
            <p>We regret to inform you that we cannot offer admission at this time.</p>
          `}
        `,
      });
    }
  }

  await Admission.populate(admission, [
    { path: 'applyingForClass', select: 'name code grade' },
    { path: 'reviewedBy', select: 'name' },
  ]);

  res.json({
    success: true,
    message: 'Admission updated successfully',
    data: { admission },
  });
});

export const deleteAdmission = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const admission = await Admission.findByIdAndDelete(req.params.id);
  if (!admission) throw new NotFoundError('Admission not found');

  res.json({
    success: true,
    message: 'Admission deleted successfully',
  });
});

export const acceptAdmission = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const admission = await Admission.findById(req.params.id);
  if (!admission) throw new NotFoundError('Admission not found');

  if (admission.status === 'accepted' && admission.studentProfile) {
    const student = await Student.findById(admission.studentProfile).populate('user', 'name email phone avatar').populate('class', 'name code grade section');
    return void res.json({ success: true, message: 'Admission was already accepted', data: { admission, student } });
  }

  if (!['pending', 'under-review', 'interview-scheduled', 'waitlisted'].includes(admission.status)) {
    throw new BadRequestError('Admission is not eligible for acceptance');
  }

  const classDoc = await Class.findById(admission.applyingForClass);
  if (!classDoc) throw new NotFoundError('Class not found');
  if (classDoc.currentStrength >= classDoc.capacity) throw new BadRequestError('Class is at full capacity');

  const rollNumber = admission.rollNumber || `${classDoc.code}${String(classDoc.currentStrength + 1).padStart(3, '0')}`;
  const generatedEmail = `${admission.admissionNumber.toLowerCase()}@student.sevenstar.local`;
  const studentEmail = generatedEmail;
  const temporaryPassword = `SS${Math.random().toString(36).slice(2, 8)}!${Math.floor(10 + Math.random() * 90)}`;

  const user = await User.create({
    name: `${admission.student.firstName} ${admission.student.middleName ? admission.student.middleName + ' ' : ''}${admission.student.lastName}`.trim(),
    email: studentEmail,
    password: temporaryPassword,
    phone: admission.father.phone,
    role: 'student',
  });

  const student = await Student.create({
    user: user._id,
    admissionNumber: admission.admissionNumber,
    rollNumber,
    class: admission.applyingForClass,
    section: classDoc.section,
    dateOfBirth: admission.student.dateOfBirth,
    gender: admission.student.gender,
    bloodGroup: admission.student.bloodGroup,
    nationality: admission.student.nationality,
    religion: admission.student.religion,
    motherTongue: admission.student.motherTongue,
    fatherName: admission.father.name,
    fatherOccupation: admission.father.occupation,
    fatherPhone: admission.father.phone,
    motherName: admission.mother.name,
    motherOccupation: admission.mother.occupation,
    motherPhone: admission.mother.phone,
    guardianName: admission.guardian?.name,
    guardianPhone: admission.guardian?.phone,
    guardianRelation: admission.guardian?.relation,
    address: admission.address,
    previousSchool: admission.student.previousSchool,
    previousClass: admission.student.previousClass,
    academicYear: admission.academicYear,
    status: 'active',
  });

  classDoc.currentStrength += 1;
  await classDoc.save();

  admission.status = 'accepted';
  admission.admissionDate = new Date();
  admission.rollNumber = rollNumber;
  admission.reviewedBy = new mongoose.Types.ObjectId(req.userId);
  admission.reviewedAt = new Date();
  admission.studentUser = user._id;
  admission.studentProfile = student._id;
  await admission.save();

  const email = admission.father.email || admission.mother.email;
  if (email) {
    try {
      await sendEmail({
        to: email,
        subject: 'Admission Accepted - Seven Star School',
        html: `
          <h2>Congratulations! Admission Accepted</h2>
          <p>Dear ${admission.father.name},</p>
          <p>Your child <strong>${admission.student.firstName} ${admission.student.lastName}</strong> has been accepted to <strong>${classDoc.name}</strong>.</p>
          <p><strong>Admission Number:</strong> ${admission.admissionNumber}</p>
          <p><strong>Roll Number:</strong> ${rollNumber}</p>
          <p><strong>Student login:</strong> ${studentEmail}</p>
          <p><strong>Temporary password:</strong> ${temporaryPassword}</p>
          <p>Please change the temporary password after first login.</p>
        `,
      });
    } catch (emailError) {
      console.error('Admission accepted, but notification email failed:', emailError);
    }
  }

  await student.populate('user', 'name email phone avatar');
  await student.populate('class', 'name code grade section');
  res.json({ success: true, message: 'Admission accepted and student account created successfully', data: { admission, student } });
});

export const getAdmissionStats = asyncHandler(async (req: AuthRequest, res: Response): Promise<void> => {
  const { academicYear } = req.query;
  const query: any = {};
  if (academicYear) query.academicYear = academicYear;

  const stats = await Admission.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const classStats = await Admission.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$applyingForClass',
        count: { $sum: 1 },
      },
    },
  ]);

  const classes = await Class.find({ _id: { $in: classStats.map(s => s._id) } }).select('name code grade');

  res.json({
    success: true,
    data: {
      statusStats: stats,
      classStats: classStats.map(s => ({
        class: classes.find(c => c._id.equals(s._id)),
        count: s.count,
      })),
    },
  });
});