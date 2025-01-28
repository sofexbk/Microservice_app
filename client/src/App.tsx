import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import DefaultLayout from './layout/DefaultLayout';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import ResetPassword from './pages/Authentication/ResetPassword';
import EvenementAtt from './pages/Parrain/EvenementAtt';
import NotFound from './pages/NotFound';
import EvenementVal from './pages/Parrain/EvenementVal';
import Account from './pages/Account';
import EvenementAttSup from './pages/SuperParrain/EvenementAttSup';
import EvenementValSup from './pages/SuperParrain/EvenementValSup';
import EvenementAttPM from './pages/SuperParrain/EvenementAttPM';
import EventParrainMarrain from './pages/SuperParrain/EventParrainMarrain';
import EventPrésident from './pages/SuperParrain/EventPrésident';
import EvenementArchivés from './pages/SuperParrain/EvenementArchivés';
import CreateEvent from './pages/President/CreateEvent';
import Evenement from './pages/President/Evenements';
import ListeNoire from './pages/SuperParrain/ListeNoire';
import PrésidentsEnRetard from './pages/SuperParrain/PrésidentsEnRetard';
import Calendrier from './pages/SuperParrain/Calendrier';
import CompteRendu from './pages/President/CompteRendu';
import PrivateRoute from './pages/PrivateRoute';
import StatistiquesDashboard from './pages/SuperParrain/StatistiquesDashboard';
import Structures from './pages/SuperParrain/Structures';
import AllUsersEvent from './pages/SuperParrain/AllUsers';
import HomePage from './pages/HomePage';
import PendingUsersEvent from './pages/SuperParrain/PendingUsersEvent';
import CreateEventSuper from './pages/SuperParrain/CreateEventSuper';
import DeposerSuper from './pages/SuperParrain/DeposerSuper';
import EvenementsSuper from './pages/SuperParrain/EvenementsSuper';
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

        <Route
          path="/account"
          element={<PrivateRoute  element={          
            <DefaultLayout>
              <PageTitle title="Compte" />
              <Account />
            </DefaultLayout>
          }
        />}/>

       <Route
          path="/super/eventsAtt"
          element={<PrivateRoute  element={  
            <DefaultLayout>
              <PageTitle title="Événement en attente de validation" />
              <EvenementAttSup />
            </DefaultLayout>
          }
          allowedRoles={['SUPER_PARRAIN']}
        />}/>
  <Route
          path="/super/eventsAttpm"
          element={<PrivateRoute  element={  
            <DefaultLayout>
              <PageTitle title="Événement en attente de validation (P/M)" />
              <EvenementAttPM />
            </DefaultLayout>
          }
          allowedRoles={['SUPER_PARRAIN']}
        />}/>
         <Route
          path="/super/createevent"
          element={<PrivateRoute  element={  
            <DefaultLayout>
              <PageTitle title="Créer événement" />
              <CreateEventSuper />
            </DefaultLayout>
          }
          allowedRoles={['SUPER_PARRAIN']}
        />}/>
     <Route
          path="/super/evvalidé"
          element={<PrivateRoute  element={  
            <DefaultLayout>
              <PageTitle title="Événement Validé" />
              <EvenementValSup />
            </DefaultLayout>
          }
          allowedRoles={['SUPER_PARRAIN']}
        />}/>
      <Route
          path="/super/pm"
          element={<PrivateRoute  element={  
            <DefaultLayout>
              <PageTitle title="Parrains/Marraines" />
              <EventParrainMarrain />
            </DefaultLayout>
          }
          allowedRoles={['SUPER_PARRAIN']}
        />}/>
    <Route
          path="/super/présidents"
          element={<PrivateRoute  element={  
            <DefaultLayout>
              <PageTitle title="Président(e)s" />
              <EventPrésident />
            </DefaultLayout>
          }
          allowedRoles={['SUPER_PARRAIN']}
        />}/>
      <Route
          path="/super/evarchivé"
          element={<PrivateRoute  element={  
            <DefaultLayout>
              <PageTitle title="Événement Archivés" />
              <EvenementArchivés />
            </DefaultLayout>
          }
          allowedRoles={['SUPER_PARRAIN']}
        />}/>
        <Route
          path="/super/listenoire"
          element={<PrivateRoute  element={  
            <DefaultLayout>
              <PageTitle title="Liste Noire" />
              <ListeNoire />
            </DefaultLayout>
          }
          allowedRoles={['SUPER_PARRAIN']}
        />}/>
        <Route
          path="/super/retard"
          element={<PrivateRoute  element={  
            <DefaultLayout>
              <PageTitle title="Président(e)s en retard" />
              <PrésidentsEnRetard />
            </DefaultLayout>
          }
          allowedRoles={['SUPER_PARRAIN']}
        />}/>
     <Route
          path="/super/calendar"
          element={<PrivateRoute  element={  
            <DefaultLayout>
              <PageTitle title="Calendrier" />
              <Calendrier />
            </DefaultLayout>
          }
          allowedRoles={['SUPER_PARRAIN']}
        />}/>
          <Route
          path="/stats"
          element={<PrivateRoute  element={  
            <DefaultLayout>
              <PageTitle title="Statistiques" />
              <StatistiquesDashboard />
            </DefaultLayout>
          }
          allowedRoles={['SUPER_PARRAIN']}
        />
        }
        />
        <Route
          path="/users"
          element={<PrivateRoute  element={  
            <DefaultLayout>
              <PageTitle title="Tous les utilisateurs" />
              <AllUsersEvent />
            </DefaultLayout>
          }
          allowedRoles={['SUPER_PARRAIN']}
        />
        }
        />
          <Route
          path="/users/pending"
          element={<PrivateRoute  element={  
            <DefaultLayout>
              <PageTitle title="Utilisateur en attente d'activation" />
              <PendingUsersEvent />
            </DefaultLayout>
          }
          allowedRoles={['SUPER_PARRAIN']}
        />
        }
        />
            <Route
          path="/structures"
          element={<PrivateRoute  element={  
            <DefaultLayout>
              <PageTitle title="Structures" />
              <Structures />
            </DefaultLayout>
          }
          allowedRoles={['SUPER_PARRAIN']}
        />
        }
        />
                  <Route
          path="/super/evcrées"
          element={<PrivateRoute  element={  
            <DefaultLayout>
              <PageTitle title="Événements Externes" />
              <EvenementsSuper />
            </DefaultLayout>
          }
          allowedRoles={['SUPER_PARRAIN']}
        />
        }
        />
        <Route
          path="/super/crendu"
          element={<PrivateRoute  element={  
            <DefaultLayout>
              <PageTitle title="Déposer compte rendu" />
              <DeposerSuper />
            </DefaultLayout>
          }
          allowedRoles={['SUPER_PARRAIN']}
        />}/>
        <Route
          path="/president/create"
          element={<PrivateRoute  element={  
            <DefaultLayout>
              <PageTitle title="Créer événement" />
              <CreateEvent />
            </DefaultLayout>
          }
          allowedRoles={['PRESIDENT']}
        />}/>
        <Route
          path="/president/crendu"
          element={<PrivateRoute  element={  
            <DefaultLayout>
              <PageTitle title="Déposer compte rendu" />
              <CompteRendu />
            </DefaultLayout>
          }
          allowedRoles={['PRESIDENT']}
        />}/>

      <Route
          path="/president/events"
          element={<PrivateRoute  element={  
            <DefaultLayout>
              <PageTitle title="Vos événements" />
              <Evenement />
            </DefaultLayout>
          }
          allowedRoles={['PRESIDENT']}

        />}/>

     <Route
          path="/parrain/evattente"
          element={<PrivateRoute  element={  
            <DefaultLayout>
              <PageTitle title="Événement en attente" />
              <EvenementAtt />
            </DefaultLayout>
          }
          allowedRoles={['PARRAIN']}
        />}/>
               <Route
          path="/parrain/evvalidé"
          element={<PrivateRoute  element={  
            <DefaultLayout>
              <PageTitle title="Événement validé" />
              <EvenementVal />
            </DefaultLayout>
          }
          allowedRoles={['PARRAIN']}
        />}/>
     
        <Route path="*" element={<NotFound />} /> 

    </Routes>
  );
}

export default App;
