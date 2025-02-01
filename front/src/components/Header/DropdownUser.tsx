import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import ClickOutside from '../ClickOutside';
import { useAuth } from '../../context/AuthContext';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { user, logout } = useAuth(); // Récupération de l'utilisateur et de la fonction logout

  const handleLogout = async () => {
    try {
      await logout(); // Déconnexion
      navigate('/login'); // Redirection vers la page de login
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        {user && (
          <span className="hidden text-right lg:block">
            <span className="block text-sm font-medium text-white dark:text-white">
              {user.email} 
            </span>
            <span className="block text-sm text-white dark:text-white">
              {user.role}
            </span>
          </span>
        )}

        <span className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
          <FontAwesomeIcon icon={faUser} className="text-xl text-white dark:text-gray-300" />
        </span>

        <svg
          className="hidden fill-current sm:block mr-1"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill="white"
          />
        </svg>
      </Link>

      {dropdownOpen && (
        <div className="absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Link
                to="#"
                onClick={handleLogout}
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.6687 1.44374C17.1187 0.893744 16.4312 0.618744 15.675 0.618744H7.42498C6.25623 0.618744 5.25935 1.58124 5.25935 2.78437V4.12499H4.29685C3.88435 4.12499 3.50623 4.46874 3.50623 4.91562C3.50623 5.36249 3.84998 5.70624 4.29685 5.70624H5.25935V10.2781H4.29685C3.88435 10.2781 3.50623 10.6219 3.50623 11.0687C3.50623 11.4812 3.84998 11.8594 4.29685 11.8594H5.25935V16.4312H4.29685C3.88435 16.4312 3.50623 16.775 3.50623 17.2219C3.50623 17.6687 3.84998 18.0125 4.29685 18.0125H5.25935V19.25C5.25935 20.4187 6.22185 21.4156 7.42498 21.4156H15.675C17.2218 21.4156 18.4937 20.1437 18.5281 18.5969V3.47187C18.4937 2.68124 18.2187 1.95937 17.6687 1.44374ZM6.07812 4.91562V2.78437C6.07812 2.40624 6.27812 2.09687 6.675 2.09687H15.675C16.0562 2.09687 16.2906 2.33749 16.2906 2.78437V4.91562H6.07812ZM16.2906 6.47187H7.42498V11.0687H16.2906V6.47187ZM16.2906 12.0969H7.42498V16.4312H16.2906V12.0969Z"
                  />
                </svg>
                Déconnexion
              </Link>
            </li>
          </ul>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
