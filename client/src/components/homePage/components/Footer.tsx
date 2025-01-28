import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaGlobe, FaInstagram, FaLinkedin,  FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
  const { t } = useTranslation(); // Use the translation hook

  return (
    <section className='w-full  p-4'>
      <div className='max-w-[1100px] m-auto flex flex-col-reverse md:flex-row justify-between items-start gap-8'>
        <div className='flex flex-col items-start'>
          <h3 className="font-bold text-2xl mt-4">{t('footer.contact')}</h3>
          <p className="py-2 text-[#60737a]">{t('footer.phone')}</p>
          <p className="py-2 text-[#363a3d]">{t('footer.email')}</p>
          <p className="py-2 text-primary font-bold ">{t('footer.rights')}</p>
        </div>

        {/* Section Réseaux Sociaux */}
        <div className='flex gap-4 items-center'>
          <a href="https://facebook.com/ensatanger" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-[#daf2f7] cursor-pointer">
            <FaFacebook size={20} className='text-primary' />
          </a>
          <a href="https://instagram.com/ensatanger" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-[#daf2f7] cursor-pointer">
            <FaInstagram size={20} className='text-primary' />
          </a>
          <a href="https://linkedin.com/company/ensatanger" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-[#daf2f7] cursor-pointer">
            <FaLinkedin size={20} className='text-primary' />
          </a>
          <a href="https://youtube.com/@ensadetanger5666" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-[#daf2f7] cursor-pointer">
            <FaYoutube size={20} className='text-primary' />
          </a>
          <a href="https://ensat.ac.ma/Portail/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-[#daf2f7] cursor-pointer">
            <FaGlobe  size={20} className='text-primary' />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Footer;
