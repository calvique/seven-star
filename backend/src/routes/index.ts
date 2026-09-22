import authRoutes from './auth';
import adminRoutes from './admin';
import userRoutes from './user';
import teacherRoutes from './teacher';
import studentRoutes from './student';
import classRoutes from './class';
import subjectRoutes from './subject';
import examRoutes from './exam';
import resultRoutes from './result';
import noticeRoutes from './notice';
import galleryRoutes from './gallery';
import admissionRoutes from './admission';
import downloadRoutes from './download';
import activityRoutes from './activity';
import achievementRoutes from './achievement';
import facilityRoutes from './facility';
import suggestionRoutes from './suggestion';
import contactRoutes from './contact';
import settingRoutes from './setting';

const routes = [
  { path: '/auth', router: authRoutes },
  { path: '/admins', router: adminRoutes },
  { path: '/users', router: userRoutes },
  { path: '/teachers', router: teacherRoutes },
  { path: '/students', router: studentRoutes },
  { path: '/classes', router: classRoutes },
  { path: '/subjects', router: subjectRoutes },
  { path: '/exams', router: examRoutes },
  { path: '/results', router: resultRoutes },
  { path: '/notices', router: noticeRoutes },
  { path: '/galleries', router: galleryRoutes },
  { path: '/admissions', router: admissionRoutes },
  { path: '/downloads', router: downloadRoutes },
  { path: '/activities', router: activityRoutes },
  { path: '/achievements', router: achievementRoutes },
  { path: '/facilities', router: facilityRoutes },
  { path: '/suggestions', router: suggestionRoutes },
  { path: '/contacts', router: contactRoutes },
  { path: '/settings', router: settingRoutes },
];

export default routes;