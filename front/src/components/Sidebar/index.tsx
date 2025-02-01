import  { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { getUser } from '../../pages/security/JwtDecoder';
import { PiStudentFill } from "react-icons/pi";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { FaChalkboardTeacher, FaUserPlus } from "react-icons/fa";
import { FaUserGraduate } from "react-icons/fa";
import { IoStatsChartOutline } from "react-icons/io5";
import { BsListUl } from "react-icons/bs";
import { MdOutlineManageAccounts } from "react-icons/md";

import Logo from './logo-icon.png'
import { useAuth } from '../../context/AuthContext';
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



  const {user} = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const isProfessor= user?.role === 'PROFESSOR';


  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-[#294A70] duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center text-white font-semibold text-2xl font-satoshi justify-between gap-2 px-6 py-5.5 lg:py-6.5">
         <p style={{ display: 'flex', alignItems: 'center', fontSize: '20px' }}>
          <img src={Logo} alt="Logo"height={40} width={40}  style={{ marginRight: '20px' }}  />
          GESTION ENSAT
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
          {isAdmin && (
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
             <li className="mb-1">
             <NavLink
               to="/statistiques"
               className={({ isActive }) =>
                `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                  isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                }`
              }
              style={({ isActive }) => ({
                color: 'white'// Texte blanc par défaut, et couleur spéciale si actif
              })}
            >
              <IoStatsChartOutline size={24} />
                Statistiques           ​​​
             </NavLink>
            </li>
            </ul>
          </div>
          )}
         {isAdmin && (

          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
             <li className="mb-1">
             <NavLink
               to="/students"
               className={({ isActive }) =>
                `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                  isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                }`
              }
              style={({ isActive }) => ({
                color: 'white'// Texte blanc par défaut, et couleur spéciale si actif
              })}
            >
              <PiStudentFill size={24} />
                Étudiants           ​​​
             </NavLink>
            </li>
            </ul>
          </div>
          )}
        {isAdmin && (

          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
             <li className="mb-1">
             <NavLink
               to="/professors"
               className={({ isActive }) =>
                `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                  isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                }`
              }
              style={({ isActive }) => ({
                color: 'white'// Texte blanc par défaut, et couleur spéciale si actif
              })}
            >
              <LiaChalkboardTeacherSolid size={24} />
                Professeurs           ​​​
             </NavLink>
            </li>
            </ul>
          </div>
          )}
         {isAdmin && (

          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
             <li className="mb-1">
             <NavLink
               to="/modules"
               className={({ isActive }) =>
                `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                  isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                }`
              }
              style={({ isActive }) => ({
                color: 'white'// Texte blanc par défaut, et couleur spéciale si actif
              })}
            >
              <FaChalkboardTeacher size={24} />
                Modules           ​​​
             </NavLink>
            </li>
            </ul>
          </div>
        )}
        {isAdmin && (

          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
             <li className="mb-1">
             <NavLink
               to="/inscriptions"
               className={({ isActive }) =>
                `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                  isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                }`
              }
              style={({ isActive }) => ({
                color: 'white'// Texte blanc par défaut, et couleur spéciale si actif
              })}
            >
              <FaUserPlus size={24} />
                Inscriptions           ​​​
             </NavLink>
            </li>
            </ul>
          </div>
        )}

          {isProfessor && (
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
             <li className="mb-1">
             <NavLink
               to="/prof-modules"
               className={({ isActive }) =>
                `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                  isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                }`
              }
              style={({ isActive }) => ({
                color: 'white'// Texte blanc par défaut, et couleur spéciale si actif
              })}
            >
              <BsListUl size={24} />
                Mes modules           ​​​
             </NavLink>
            </li>
            </ul>
          </div>
          )}
        {isProfessor && (

          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
             <li className="mb-1">
             <NavLink
               to="/prof-compte"
               className={({ isActive }) =>
                `group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${
                  isActive ? 'bg-[#FF6632] text-[#FF6632]' : 'text-white hover:bg-[#FF6632] hover:text-white'
                }`
              }
              style={({ isActive }) => ({
                color: 'white'// Texte blanc par défaut, et couleur spéciale si actif
              })}
            >
              <MdOutlineManageAccounts size={24} />
                Mon compte           ​​​
             </NavLink>
            </li>
            </ul>
          </div>
          )}
          


        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
