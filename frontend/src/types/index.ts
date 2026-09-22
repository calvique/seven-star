// User & Auth
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  avatar?: string;
  isEmailVerified: boolean;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Teacher
export interface Teacher {
  _id: string;
  user: User;
  employeeId: string;
  designation: string;
  department: string;
  qualification: string[];
  experience: number;
  dateOfJoining: string;
  dateOfBirth?: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  address: {
    permanent: string;
    temporary?: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  assignedClasses: Class[];
  assignedSubjects: Subject[];
  salary?: {
    basic: number;
    allowances: number;
    deductions: number;
  };
  bankDetails?: {
    accountNumber: string;
    bankName: string;
    branch: string;
  };
  documents: {
    citizenship?: string;
    qualificationCertificates: string[];
    experienceLetters: string[];
    photo: string;
  };
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  status: 'active' | 'inactive' | 'on-leave' | 'terminated';
  createdAt: string;
  updatedAt: string;
}

// Student
export interface Student {
  _id: string;
  user: User;
  admissionNumber: string;
  rollNumber?: string;
  class: Class;
  section?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup?: string;
  nationality: string;
  religion?: string;
  motherTongue?: string;
  fatherName: string;
  fatherOccupation?: string;
  fatherPhone?: string;
  motherName: string;
  motherOccupation?: string;
  motherPhone?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;
  address: {
    permanent: string;
    temporary?: string;
  };
  previousSchool?: string;
  previousClass?: string;
  documents: {
    birthCertificate?: string;
    transferCertificate?: string;
    markSheet?: string;
    photo: string;
    citizenship?: string;
  };
  admissionDate: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred' | 'dropped';
  academicYear: string;
  createdAt: string;
  updatedAt: string;
}

// Class
export interface Class {
  _id: string;
  name: string;
  code: string;
  level: 'pre-primary' | 'primary' | 'lower-secondary' | 'secondary' | 'higher-secondary';
  grade: number;
  section?: string;
  capacity: number;
  currentStrength: number;
  classTeacher?: Teacher;
  subjects: Subject[];
  academicYear: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Subject
export interface Subject {
  _id: string;
  name: string;
  code: string;
  class: Class | string;
  teacher?: Teacher | string;
  credits: number;
  isCore: boolean;
  description?: string;
  syllabus?: string;
  academicYear: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Exam
export interface ExamSubject {
  subject: Subject;
  date: string;
  startTime: string;
  endTime: string;
  maxMarks: number;
  passMarks: number;
  room?: string;
  invigilator?: Teacher;
}

export interface Exam {
  _id: string;
  name: string;
  type: 'unit-test' | 'terminal' | 'half-yearly' | 'annual' | 'pre-board' | 'board' | 'practical' | 'assignment';
  academicYear: string;
  class: Class;
  subjects: ExamSubject[];
  startDate: string;
  endDate: string;
  isPublished: boolean;
  publishedAt?: string;
  publishedBy?: User;
  description?: string;
  instructions?: string;
  createdAt: string;
  updatedAt: string;
}

// Result
export interface Result {
  _id: string;
  student: Student;
  exam: Exam;
  subject: Subject;
  class: Class;
  academicYear: string;
  marksObtained: number;
  maxMarks: number;
  grade?: string;
  gradePoint?: number;
  isPass: boolean;
  rank?: number;
  percentile?: number;
  remarks?: string;
  enteredBy: User;
  enteredAt: string;
  verifiedBy?: User;
  verifiedAt?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  percentage?: number;
}

// Notice
export interface Notice {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: 'general' | 'academic' | 'exam' | 'admission' | 'event' | 'holiday' | 'urgent' | 'facility' | 'sports' | 'cultural';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: ('all' | 'students' | 'teachers' | 'parents' | 'staff')[];
  classes?: Class[];
  publishedBy: User;
  publishedAt?: string;
  expiresAt?: string;
  attachments: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  images: string[];
  isPublished: boolean;
  isPinned: boolean;
  views: number;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt: string;
  updatedAt: string;
}

// Gallery
export interface Gallery {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  category: 'academic' | 'sports' | 'cultural' | 'events' | 'facilities' | 'achievements' | 'trips' | 'alumni' | 'general';
  images: {
    url: string;
    alt?: string;
    caption?: string;
    order: number;
  }[];
  coverImage?: string;
  eventDate?: string;
  location?: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  publishedBy?: User;
  views: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// Admission
export interface Admission {
  _id: string;
  admissionNumber: string;
  academicYear: string;
  applyingForClass: Class;
  student: {
    firstName: string;
    middleName?: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    bloodGroup?: string;
    nationality: string;
    religion?: string;
    motherTongue?: string;
    previousSchool?: string;
    previousClass?: string;
  };
  father: {
    name: string;
    occupation?: string;
    phone: string;
    email?: string;
    officeAddress?: string;
  };
  mother: {
    name: string;
    occupation?: string;
    phone: string;
    email?: string;
    officeAddress?: string;
  };
  guardian?: {
    name: string;
    relation: string;
    phone: string;
    address?: string;
  };
  address: {
    permanent: {
      province: string;
      district: string;
      municipality: string;
      ward: string;
      tole: string;
    };
    temporary?: {
      province: string;
      district: string;
      municipality: string;
      ward: string;
      tole: string;
    };
  };
  documents: {
    birthCertificate?: string;
    transferCertificate?: string;
    markSheet?: string;
    photo?: string;
    citizenshipFather?: string;
    citizenshipMother?: string;
    ppSizePhotos?: string[];
  };
  status: 'pending' | 'under-review' | 'interview-scheduled' | 'accepted' | 'rejected' | 'waitlisted' | 'cancelled';
  applicationDate: string;
  reviewedBy?: User;
  reviewedAt?: string;
  interviewDate?: string;
  interviewNotes?: string;
  admissionDate?: string;
  rollNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Download
export interface Download {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  category: 'admission' | 'academic' | 'exam' | 'result' | 'calendar' | 'form' | 'policy' | 'circular' | 'syllabus' | 'other';
  file: {
    url: string;
    name: string;
    type: string;
    size: number;
  };
  thumbnail?: string;
  isPublic: boolean;
  targetAudience: ('all' | 'students' | 'teachers' | 'parents' | 'staff')[];
  downloadCount: number;
  publishedBy: User;
  publishedAt?: string;
  expiresAt?: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// Activity
export interface Activity {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: 'sports' | 'cultural' | 'academic' | 'club' | 'community' | 'leadership' | 'creative' | 'other';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'one-time';
  schedule?: {
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
    startDate?: string;
    endDate?: string;
  };
  location?: string;
  coordinator?: Teacher;
  participants: Student[];
  maxParticipants?: number;
  gradeLevel?: number[];
  images: string[];
  documents: string[];
  isActive: boolean;
  isPublished: boolean;
  publishedAt?: string;
  publishedBy?: User;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// Achievement
export interface Achievement {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: 'academic' | 'sports' | 'cultural' | 'leadership' | 'community' | 'innovation' | 'arts' | 'other';
  level: 'school' | 'district' | 'provincial' | 'national' | 'international';
  student?: Student;
  teacher?: Teacher;
  class?: Class;
  team?: string;
  eventName?: string;
  eventDate: string;
  position?: string;
  award?: string;
  certificateUrl?: string;
  images: string[];
  isPublished: boolean;
  publishedAt?: string;
  publishedBy?: User;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// Facility
export interface Facility {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: 'academic' | 'sports' | 'laboratory' | 'library' | 'hostel' | 'transport' | 'cafeteria' | 'medical' | 'auditorium' | 'playground' | 'other';
  location?: string;
  capacity?: number;
  features: string[];
  images: {
    url: string;
    alt?: string;
    caption?: string;
    isCover: boolean;
  }[];
  specifications?: Record<string, string>;
  isActive: boolean;
  isPublished: boolean;
  publishedAt?: string;
  publishedBy?: User;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

// Suggestion
export interface Suggestion {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  category: 'general' | 'academic' | 'facility' | 'teacher' | 'activity' | 'administration' | 'safety' | 'food' | 'transport' | 'other';
  subject: string;
  message: string;
  isAnonymous: boolean;
  status: 'pending' | 'in-review' | 'resolved' | 'rejected' | 'implemented';
  assignedTo?: User;
  response?: string;
  respondedBy?: User;
  respondedAt?: string;
  priority: 'low' | 'medium' | 'high';
  attachments: string[];
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

// Contact
export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: 'admission' | 'general' | 'academic' | 'facility' | 'complaint' | 'feedback' | 'other';
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  assignedTo?: User;
  response?: string;
  respondedBy?: User;
  respondedAt?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

// Setting
export interface Setting {
  _id: string;
  key: string;
  value: string | number | boolean | object | any[];
  group: string;
  label: string;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'json' | 'image' | 'file' | 'color' | 'date' | 'select';
  options?: { value: string; label: string }[];
  validation?: string;
  isPublic: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Pagination
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    [key: string]: T[];
    pagination: Pagination;
  };
}

export interface SingleResponse<T> {
  success: boolean;
  data: { [key: string]: T };
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: { field: string; message: string }[];
}

// School Settings (Public)
export interface SchoolSettings {
  general?: Setting[];
  contact?: Setting[];
  social?: Setting[];
  seo?: Setting[];
}