# Seven Star School — Data Flow

## Student admission

1. A parent submits the public admission form.
2. The API validates the form and stores the complete application in the MongoDB `admissions` collection.
3. The application receives a unique `admissionNumber`.
4. The admin reviews the application from the CMS.
5. When the admin accepts it, the backend creates:
   - a `users` record for the student's portal login;
   - a `students` record containing the permanent academic/student profile.
6. The accepted `admissions` record stores references to the created `studentUser` and `studentProfile`.
7. The student's class strength is updated.
8. The parent email, when configured, receives the admission number, roll number and student login credentials.

The student's password is stored only as a bcrypt hash in `users`; the plain temporary password is not stored in MongoDB.

## Teacher signup/login

1. A teacher uses the public registration page.
2. The backend creates a `users` record with `role = teacher`.
3. It also creates a `teachers` record linked to that user.
4. The teacher profile starts as `isApproved = false` and `status = inactive`.
5. The teacher cannot log in until an administrator approves the profile.
6. The admin approves the teacher and assigns classes/subjects through the CMS.
7. Approval changes the teacher profile to `isApproved = true` and `status = active`.
8. The teacher can then log in using the email/password stored through the `users` authentication system.

Passwords are never stored in plain text; the `User` model hashes them with bcrypt.

## Academic data

- `users`: login identities, roles, hashed passwords, account status.
- `teachers`: teacher profile, approval, classes and subjects.
- `students`: enrolled student academic/profile data.
- `classes`: classes/sections, capacity and class teacher.
- `subjects`: class subjects and teacher assignment.
- `exams`: exam definitions and schedules.
- `results`: subject results entered by approved teachers/admins.
- `admissions`: applications and admission workflow history.

MongoDB Atlas is the source of truth for these records. The React frontend does not permanently store admission or teacher records.
