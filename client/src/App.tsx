import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import DefaultLayout from './layout/DefaultLayout';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import ResetPassword from './pages/Authentication/ResetPassword';
import NotFound from './pages/NotFound';

import Account from './pages/Account';
import HomePage from './pages/HomePage';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on route change
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000); // Simulate loading for 1 second
  }, []);

  return loading ? (
    <Loader /> // Show loader while loading initial content
  ) : (
    <Routes>
      <Route path="/auth/signin" element={<SignIn />} />
      <Route path="/auth/signup" element={<SignUp />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<HomePage />} />



  
     
        <Route path="*" element={<NotFound />} /> 

    </Routes>
  );
}

export default App;
/*<Route
path="/account"
element={<PrivateRoute  element={          
  <DefaultLayout>
    <PageTitle title="Compte" />
    <Account />
  </DefaultLayout>
}
/>}/>
/*       <Route
path="/super/eventsAtt"
element={<PrivateRoute  element={  
  <DefaultLayout>
    <PageTitle title="Événement en attente de validation" />
    <EvenementAttSup />
  </DefaultLayout>
}
allowedRoles={['SUPER_PARRAIN']}
/>}/>*/