import  { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getUser } from '../../pages/security/JwtDecoder';
import Logo from './logo-icon.png'
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);
  const location = useLocation();
  const { pathname } = location;
  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true'
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);



  const user = getUser();
  const isPresident = user?.role === 'PRESIDENT';
  const isParrain = user?.role === 'PARRAIN';
  const isSuperParrain = user?.role === 'SUPER_PARRAIN';

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-[#294A70] duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center text-white font-semibold text-2xl font-satoshi justify-between gap-2 px-6 py-5.5 lg:py-6.5">
         <p style={{ display: 'flex', alignItems: 'center', fontSize: '25px' }}>
          <img src={Logo} alt="Logo"height={40} width={40}  style={{ marginRight: '20px' }}  />ENSAT EVENT
        </p>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-1 py-4 px-4 lg:mt-1 lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              {isPresident &&
             <li className="mb-1">
             <NavLink
               to="/president/create"
               className={({ isActive }) =>
                `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                  isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                }`
              }
              style={({ isActive }) => ({
                color: 'white'// Texte blanc par défaut, et couleur spéciale si actif
              })}
            >
           <svg
             viewBox="0 0 24 24"
             fill="currentColor"
             height="25"
             width="26"
             xmlns="http://www.w3.org/2000/svg"
           >
             <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .89-2 2v16c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 18H5V10h14v11zm0-13H5V5h14v3z"/>
             <path d="M13 12h-2v3H8v2h3v3h2v-3h3v-2h-3v-3z"/>
           </svg>
               Créer un événement ​​​
             </NavLink>
            </li>}

              {isPresident &&  
              <li className="mb-1">
                <NavLink
                  to="/president/crendu"
                   className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                      isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: 'white'// Texte blanc par défaut, et couleur spéciale si actif
                  })}
                >
               <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                height="25"
                width="26"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1 0.9 2 2 2h14c1.1 0 2-0.9 2-2V6c0-1.1-0.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"
                />
              </svg>
                  Déposer compte rendu
                </NavLink>
              </li> }
              
              {isPresident &&<li>
                <NavLink
                  to="/president/events"
                   className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                      isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: 'white'// Texte blanc par défaut, et couleur spéciale si actif
                  })}
                >
               <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                height="25"
                width="26"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1 0.9 2 2 2h14c1.1 0 2-0.9 2-2V6c0-1.1-0.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"
                />
              </svg>
                  Vos événements ​
                </NavLink>
              </li> 
              }
           


              {isParrain && <li className="mb-1">
                <NavLink
                  to="/parrain/evattente"
                  className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                      isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: 'white'// Texte blanc par défaut, et couleur spéciale si actif
                  })}
                >
               <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                height="25"
                width="26"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1 0.9 2 2 2h14c1.1 0 2-0.9 2-2V6c0-1.1-0.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"
                />
              </svg>
                Événements en attente
                </NavLink>
              </li> } 

               {isParrain && <li className="mb-1">
                <NavLink
                  to="/parrain/evvalidé"
                  className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                      isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: 'white'// Texte blanc par défaut, et couleur spéciale si actif
                  })}
                >
               <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                height="25"
                width="26"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1 0.9 2 2 2h14c1.1 0 2-0.9 2-2V6c0-1.1-0.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"
                />
              </svg>
                  Événements validés
                </NavLink>
              </li>}



              {isSuperParrain && <li className="mb-1">
                <NavLink
                  to="/super/eventsAtt"
                   className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                      isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: 'white', // Texte blanc par défaut, et couleur spéciale si actif
                  })}
                >
               <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                height="25"
                width="26"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1 0.9 2 2 2h14c1.1 0 2-0.9 2-2V6c0-1.1-0.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"
                />
              </svg>
                   Événements en attente
              </NavLink>
              </li>}

              {isSuperParrain && <li className="mb-1">
                <NavLink
                  to="/super/eventsAttpm"
                   className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                      isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: 'white', // Texte blanc par défaut, et couleur spéciale si actif
                  })}
                >
               <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                height="25"
                width="26"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1 0.9 2 2 2h14c1.1 0 2-0.9 2-2V6c0-1.1-0.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"
                />
              </svg>
                   Événements en attente (P/M)
                </NavLink>
                </li>}


                {isSuperParrain && <li className="mb-1">
                <NavLink
                  to="/super/evvalidé"
                     className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                      isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: 'white'// Texte blanc par défaut, et couleur spéciale si actif
                  })}
                >
               <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                height="25"
                width="26"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1 0.9 2 2 2h14c1.1 0 2-0.9 2-2V6c0-1.1-0.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"
                />
              </svg>
                  Événements validés
                </NavLink>
              </li>}
              {isSuperParrain &&<li className="mb-1">
                <NavLink
                    to="/structures"
                    className={({ isActive }) =>
                        `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                            isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                        }`
                    }
                    style={({ isActive }) => ({
                      color: 'white', // Texte blanc par défaut, et couleur spéciale si actif
                    })}
                >
                  <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      height="25"
                      width="25"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 4.5c-1.11 0-2 .89-2 2s.89 2 2 2 2-.89 2-2-.89-2-2-2zm0 3.5c-.83 0-1.5-.67-1.5-1.5S11.17 5 12 5s1.5.67 1.5 1.5S12.83 8 12 8zm-6 4.5c-1.66 0-3 1.34-3 3v1h18v-1c0-1.66-1.34-3-3-3H6zm6 2.5c-2.21 0-4-1.79-4-4H4v2c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4v-2h-2c0 2.21-1.79 4-4 4zm0-8c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5-.67 1.5-1.5S12.83 5 12 5s-1.5.67-1.5 1.5S11.17 8 12 8z"/>
                  </svg>
                  Structures
                </NavLink>
              </li> }
              {isSuperParrain &&<li className="mb-1">
                <NavLink
                    to="/users/pending"
                    className={({ isActive }) =>
                        `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                            isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                        }`
                    }
                    style={({ isActive }) => ({
                      color: 'white', // Texte blanc par défaut, et couleur spéciale si actif
                    })}
                >
                  <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      height="25"
                      width="26"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-7-7c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3zm14 0c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3z"/>
                  </svg>
                  Utilisateurs en attente d'activation
                </NavLink>
              </li> }

              {isSuperParrain && <li className="mb-1">
                <NavLink
                  to="/super/pm"
                   className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                      isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: 'white'// Texte blanc par défaut, et couleur spéciale si actif
                  })}
                >
             <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                height="25"
                width="26"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z"/>
              </svg>
                  Parrains/Marraines
                </NavLink>
              </li>} 
             {isSuperParrain &&<li className="mb-1">
                <NavLink
                  to="/super/présidents"
                      className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                      isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: 'white'// Texte blanc par défaut, et couleur spéciale si actif
                  })}
                >
               <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height="25"
                  width="26"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                  Président(e)s
                </NavLink>
              </li> } 
              {isSuperParrain && <li className="mb-1">
                <NavLink
                  to="/super/calendar"
                   className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                      isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: 'white', // Texte blanc par défaut, et couleur spéciale si actif
                  })}
                >
                  <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height="25"
                  width="26"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 3h-1V2h-2v1H8V2H6v1H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H5V9h14v12zm-7-7c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/>
                </svg>

                Calendrier                
              </NavLink>
              </li>} 
             {isSuperParrain &&<li className="mb-1">
                <NavLink
                  to="/super/retard"
                   className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                      isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: 'white', // Texte blanc par défaut, et couleur spéciale si actif
                  })}
                >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                height="25"
                width="26"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
                  Président(e)s en retard 
                </NavLink>
              </li> } 

             {isSuperParrain &&<li className="mb-1">
                <NavLink
                  to="/super/evarchivé"
                   className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                      isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: 'white'
                  })}
                >
              <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              height="25"
              width="26"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.54 5.23l-1.39-1.39A2 2 0 0 0 17.7 3H6.3a2 2 0 0 0-1.45.61L3.46 5.23C3.17 5.52 3 5.96 3 6.41V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.41c0-.45-.17-.89-.46-1.18zM5.12 5l.94-.94A1 1 0 0 1 6.3 4h11.4a1 1 0 0 1 .24.06L19.88 5H5.12zM20 20H4v-9h16v9zm0-10H4V6.41L5.41 5h13.18L20 6.41V10z"/>
            </svg>
                  Événements archivés
                </NavLink>
              </li> } 


              {isSuperParrain &&<li className="mb-1">
                <NavLink
                  to="/stats"
                   className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                      isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: 'white', // Texte blanc par défaut, et couleur spéciale si actif
                  })}
                >
               <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    height="25"
                    width="26"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M3 13h2v8H3v-8zm4-4h2v12H7V9zm4-4h2v16h-2V5zm4 6h2v10h-2V11zm4-8h2v18h-2V3z"/>
                  </svg>
                  Statistiques
                </NavLink>
              </li> }
              {isSuperParrain &&<li className="mb-1">
                <NavLink
                  to="/users"
                  className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                      isActive && !pathname.includes("/users/pending") ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: 'white', // Texte blanc par défaut, et couleur spéciale si actif
                  })}
                >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  height="25"
                  width="26"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm-7-7c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3zm14 0c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3z"/>
                </svg>
                 Tous les utilisateurs
                </NavLink>
              </li> } 
              {isSuperParrain &&<li className="mb-1">
                <NavLink
                  to="/super/createevent"
                   className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                      isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: 'white', // Texte blanc par défaut, et couleur spéciale si actif
                  })}
                >
               <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                height="25"
                width="25"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 4.5c-1.11 0-2 .89-2 2s.89 2 2 2 2-.89 2-2-.89-2-2-2zm0 3.5c-.83 0-1.5-.67-1.5-1.5S11.17 5 12 5s1.5.67 1.5 1.5S12.83 8 12 8zm-6 4.5c-1.66 0-3 1.34-3 3v1h18v-1c0-1.66-1.34-3-3-3H6zm6 2.5c-2.21 0-4-1.79-4-4H4v2c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4v-2h-2c0 2.21-1.79 4-4 4zm0-8c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5-.67 1.5-1.5S12.83 5 12 5s-1.5.67-1.5 1.5S11.17 8 12 8z"/>
              </svg>
                  Créer un événement externe
                </NavLink>
              </li> }
              {isSuperParrain &&<li className="mb-1">
                <NavLink
                  to="/super/evcrées"
                   className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                      isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: 'white', // Texte blanc par défaut, et couleur spéciale si actif
                  })}
                >
               <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                height="25"
                width="26"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1 0.9 2 2 2h14c1.1 0 2-0.9 2-2V6c0-1.1-0.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"
                />
              </svg>
              Événements externes
                </NavLink>
              </li> }
              {isSuperParrain &&<li className="mb-1">
                <NavLink
                  to="/super/crendu"
                   className={({ isActive }) =>
                    `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                      isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                    }`
                  }
                  style={({ isActive }) => ({
                    color: 'white', // Texte blanc par défaut, et couleur spéciale si actif
                  })}
                >
               <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                height="25"
                width="26"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 4h-1V2h-2v2H8V2H6v2H5C3.9 4 3 4.9 3 6v14c0 1.1 0.9 2 2 2h14c1.1 0 2-0.9 2-2V6c0-1.1-0.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"
                />
              </svg>
              Déposer compte rendu (Evén ext)
                </NavLink>
              </li> }
              {isSuperParrain &&
                  <li className="mb-1">
                    <NavLink
                        to="/super/listenoire"
                        className={({ isActive }) =>
                            `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                                isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                            }`
                        }
                        style={({ isActive }) => ({
                          color: 'white', // Texte blanc par défaut, et couleur spéciale si actif
                        })}
                    >
                      <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          height="25"
                          width="26"
                          xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.59L16.59 17 12 12.41 7.41 17 6 15.59 10.59 11 6 6.41 7.41 5 12 9.59 16.59 5 18 6.41 13.41 11 18 15.59z"/>
                      </svg>
                      Liste noire
                    </NavLink>
                  </li> }
            </ul>
          </div>

          {/* <!-- Others Group --> */}
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
            </ul>
          </div>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
