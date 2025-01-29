import { useEffect, useState } from 'react';
import { Link  } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import ClickOutside from '../ClickOutside';
import Cookies from 'js-cookie';
import { useAuthContext } from '../../context/AuthContext'; // Adjust the import path as necessary
import {  getUserInfoFromToken } from '../../pages/security/JwtDecoder';

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const { logout } = useAuthContext(); // Get logout function from context

  const handleLogout = async () => {
    try {
      await logout(); // Ensure logout completes
      setDropdownOpen(false); // Close the dropdown after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  const getUserFromCookie = () => {
    const token = Cookies.get('authToken');
    if (token) {
      try {
        const user = getUserInfoFromToken(token);
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
        setEmail(user.email || "");
        setRole(user.role|| "")
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }
  };
  useEffect(() => {
    getUserFromCookie();
  }, []);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-white dark:text-white">
            {firstName} {lastName}
          </span>
          <span className="block text-sm  text-white dark:text-white">{role}</span>
        </span>

        <span className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
          <FontAwesomeIcon icon={faUser} className="text-xl text-white dark:text-gray-300" />
          
        </span>
        <svg
           className="hidden fill-current sm:block mr-1"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
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
        <div
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
        >
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Link
                to="/account"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 9.62499C8.42188 9.62499 6.35938 7.59687 6.35938 5.12187C6.35938 2.64687 8.42188 0.618744 11 0.618744C13.5781 0.618744 15.6406 2.64687 15.6406 5.12187C15.6406 7.59687 13.5781 9.62499 11 9.62499ZM11 2.16562C9.28125 2.16562 7.90625 3.50624 7.90625 5.12187C7.90625 6.73749 9.28125 8.07812 11 8.07812C12.7188 8.07812 14.0938 6.73749 14.0938 5.12187C14.0938 3.50624 12.7188 2.16562 11 2.16562Z"
                    fill=""
                  />
                  <path
                    d="M17.7719 21.4156H4.2281C3.5406 21.4156 2.9906 20.8656 2.9906 20.1781V17.0844C2.9906 13.7156 5.7406 10.9656 9.10935 10.9656H12.925C16.2937 10.9656 19.0437 13.7156 19.0437 17.0844V20.1781C19.0094 20.8312 18.4594 21.4156 17.7719 21.4156ZM4.53748 19.8687H17.4969V17.0844C17.4969 14.575 15.4344 12.5125 12.925 12.5125H9.07498C6.5656 12.5125 4.5031 14.575 4.5031 17.0844V19.8687H4.53748Z"
                    fill=""
                  />
                </svg>
                Mon compte
              </Link>
            </li>
            <li>
              <Link
                to="#"
                onClick={handleLogout} // Call handleLogout on click
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.6687 1.44374C17.1187 0.893744 16.4312 0.618744 15.675 0.618744H7.42498C6.25623 0.618744 5.25935 1.58124 5.25935 2.78437V4.12499H4.29685C3.88435 4.12499 3.50623 4.46874 3.50623 4.91562C3.50623 5.36249 3.84998 5.70624 4.29685 5.70624H5.25935V10.2781H4.29685C3.88435 10.2781 3.50623 10.6219 3.50623 11.0687C3.50623 11.4812 3.84998 11.8594 4.29685 11.8594H5.25935V16.4312H4.29685C3.88435 16.4312 3.50623 16.775 3.50623 17.2219C3.50623 17.6687 3.84998 18.0125 4.29685 18.0125H5.25935V19.25C5.25935 20.4187 6.22185 21.4156 7.42498 21.4156H15.675C17.2218 21.4156 18.4937 20.1437 18.5281 18.5969V3.47187C18.4937 2.68124 18.2187 1.95937 17.6687 1.44374ZM6.07812 4.91562V2.78437C6.07812 2.40624 6.27812 2.09687 6.675 2.09687H15.675C16.0562 2.09687 16.2906 2.33749 16.2906 2.78437V4.91562H6.07812ZM16.2906 6.47187H7.42498V11.0687H16.2906V6.47187ZM16.2906 12.0969H7.42498V16.4312H16.2906V12.0969ZM14.0144 14.4844C13.9306 14.1562 13.575 14.0144 13.2219 14.0144C12.8687 14.0144 12.5137 14.1562 12.4287 14.4844C12.2287 15.0875 11.5062 15.4812 10.7612 15.4812C10.4356 15.4812 10.1969 15.3156 10.1969 15.0687C10.1969 14.8219 10.3287 14.5969 10.675 14.5969C10.7612 14.5969 10.8562 14.6062 10.9487 14.6219C11.0719 14.6812 11.2606 14.7375 11.4537 14.8375C11.575 14.8944 11.7819 14.9156 11.9906 14.9156C12.3719 14.9156 12.8187 14.7544 12.8556 14.4844C12.9306 14.1969 12.7487 14.0144 12.4287 14.0144C12.3375 14.0144 12.2906 14.0969 12.2906 14.0969C12.124 14.2375 12.0144 14.3937 12.0144 14.5969C12.0144 14.7456 12.0375 14.8687 12.0875 14.9906C12.2175 15.3375 12.5344 15.5687 12.9306 15.5687C13.175 15.5687 13.4575 15.4544 13.6519 15.2194C13.875 14.9812 14.0144 14.7175 14.0144 14.4844Z"
                    fill=""
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
