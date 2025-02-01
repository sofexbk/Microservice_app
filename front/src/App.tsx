import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Loader from './common/Loader';
import DefaultLayout from './layout/DefaultLayout';
import AllStudents from './pages/students/AllStudents';
import LoginPage from './pages/Authentication/LoginPage';
import NotFound from './pages/NotFound';
import AllProfessors from './pages/professors/AllProfessors';
import AllModules from './pages/modules/AllModules';
import InscriptionComponent from './pages/inscriptions/InscriptionComponent';
import StatisticsDashboard from './pages/statistiques/StatisticsDashboard';
import ProfModules from './pages/professors/ProfModules';
import ProfessorProfile from './pages/professors/ProfessorProfile';
import PrivateRoute from './pages/security/PrivateRoute';
import Unauthorized from './pages/Unauthorized';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Routes administrateur */}
      <Route
        path="/students"
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <DefaultLayout>
              <AllStudents />
            </DefaultLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/professors"
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <DefaultLayout>
              <AllProfessors />
            </DefaultLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/modules"
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <DefaultLayout>
              <AllModules />
            </DefaultLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/inscriptions"
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <DefaultLayout>
              <InscriptionComponent />
            </DefaultLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/statistiques"
        element={
          <PrivateRoute allowedRoles={['ADMIN']}>
            <DefaultLayout>
              <StatisticsDashboard />
            </DefaultLayout>
          </PrivateRoute>
        }
      />

      {/* Routes professeur */}
      <Route
        path="/prof-modules"
        element={
          <PrivateRoute allowedRoles={['PROFESSOR']}>
            <DefaultLayout>
              <ProfModules />
            </DefaultLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/prof-compte"
        element={
          <PrivateRoute allowedRoles={['PROFESSOR']}>
            <DefaultLayout>
              <ProfessorProfile />
            </DefaultLayout>
          </PrivateRoute>
        }
      />

      {/* Route 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;