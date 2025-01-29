import React, { useState } from 'react';
import Logo from '../assets/logo.png';
import lock from '../assets/lock.svg';
import Hamburger from '../assets/hamburgerMenu.svg';
import Close from '../assets/close.svg';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import franceFlag from '../assets/franceFlag.png';
import ukFlag from '../assets/ukFlag.jpg';
import moroccoFlag from '../assets/moroccoFlag.png';
import spainFlag from '../assets/spainFlag.png';
interface NavbarProps {
  refs: {
    hero: React.RefObject<HTMLDivElement>;
    categories: React.RefObject<HTMLDivElement>;
    steps: React.RefObject<HTMLDivElement>;
  };
}
const Navbar: React.FC<NavbarProps> = ({ refs }) => {
  const [toggle, setToggle] = useState(false);
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleToggle = () => {
    setToggle(!toggle);
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setSelectedLanguage(lang);
  };

  const isSelected = (lang: string) => selectedLanguage === lang;

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className='w-full h-[96px] bg-white shadow-sm'>
      <div className='p-4 md:max-w-[1080px] max-w-[400px] m-auto w-full h-full flex justify-between items-center'>
        <img src={Logo} alt="logo" className='h-[60px] cursor-pointer'/>
        <div className="flex items-center">
          <ul className='hidden md:flex gap-4'>
            <li className='cursor-pointer' onClick={() => scrollToSection(refs.hero)}>{t('navbar.home')}</li>
            <li className='cursor-pointer' onClick={() => scrollToSection(refs.steps)}>{t('navbar.steps')}</li>
            <li className='cursor-pointer' onClick={() => scrollToSection(refs.categories)}>{t('navbar.cycles')}</li>
          </ul>
          {/* Language Selector for large screens with borders */}
          <div className='hidden md:flex ml-4 gap-2 pl-8'>
            <div
              className={`w-9 h-9 p-1 cursor-pointer rounded-full border-2 ${isSelected('fr') ? 'border-blue-500' : 'border-gray-300'}`}
              onClick={() => changeLanguage('fr')}
            >
              <img src={franceFlag} alt="Français" className="w-full h-full rounded-full" />
            </div>
            <div
              className={`w-9 h-9 p-1 cursor-pointer rounded-full border-2 ${isSelected('en') ? 'border-blue-500' : 'border-gray-300'}`}
              onClick={() => changeLanguage('en')}
            >
              <img src={ukFlag} alt="English" className="w-full h-full rounded-full" />
            </div>
            <div
              className={`w-9 h-9 p-1 cursor-pointer rounded-full border-2 ${isSelected('ar') ? 'border-blue-500' : 'border-gray-300'}`}
              onClick={() => changeLanguage('ar')}
            >
              <img src={moroccoFlag} alt="عربي" className="w-full h-full rounded-full" />
            </div>
            <div
              className={`w-9 h-9 p-1 cursor-pointer rounded-full border-2 ${isSelected('es') ? 'border-blue-500' : 'border-gray-300'}`}
              onClick={() => changeLanguage('es')}
            >
              <img src={spainFlag} alt="Español" className="w-full h-full rounded-full" />
            </div>
          </div>
          {/* Language Selector for small screens */}
          <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className='ml-4 p-2 md:hidden'
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">عربي</option>
            <option value="es">Español</option>
          </select>
        </div>
        <div className='md:flex hidden'>
          <Link to={"/auth/signin"} className='flex justify-content-between items-center bg-transparent px-6 gap-2'>
            <img src={lock} alt='lock'/>
            {t('navbar.login')}
          </Link>
        </div>
        <motion.div whileTap={{ scale:0.6 }} className="md:hidden cursor-pointer" onClick={handleToggle}>
          <img src={toggle ? Close : Hamburger} alt="hamburger" />
        </motion.div>
      </div>
      <div>
        <motion.ul
          initial={{ opacity:0, x:200 }}
          animate={{ opacity:1, x:0 }}
          exit={{ opacity:0, x:200 }}
          className={toggle ? 'absolute z-10 p-4 bg-white w-full px-8 md:hidden' : 'hidden'}
        >
          <li>{t('navbar.home')}</li>
          <li>{t('navbar.chiffres')}</li>
          <li>{t('navbar.cycles')}</li>
          <div className='flex flex-col my-4 gap-4'>
            <Link to={"/auth/signin"} className='flex border border-[240136] justify-center items-center bg-transparent px-6 gap-2 py-4'>
              <img src={lock} alt='lock'/>
              {t('navbar.login')}
            </Link>
            <Link to={"/auth/signup"} className='px-8 py-3 bg-primary text-white'>{t('navbar.signup')}</Link>
          </div>
        </motion.ul>
      </div>
    </div>
  );
};

export default Navbar;
