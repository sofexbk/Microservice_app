import React from 'react';
import Achieve from '../assets/achievement.png';
import { FaGraduationCap, FaTrophy, FaHandshake, FaCogs } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Achievement: React.FC = () => {
const { t } = useTranslation(); // Use the translation hook

  return (
    <section className='w-full  p-5'>
        <div className='md:max-w-[1100px] m-auto grid md:grid-cols-2 max-w-[400px]'>
            <div className='flex flex-col justify-start gap-4'>
                <h1 className='md:leading-[42px] py-2 text-3xl font-semibold'>
                     <span className='text-primary'>{t('achievement.title')}</span>
                </h1>
                <p className=' text-[#536e96] text-2xl'>{t('achievement.subtitle')}</p>
                <div className='grid md:grid-cols-2 grid-cols-1'>
                    <div className="py-6 flex">
                        <div className="p-6 bg-[#daf2f7] rounded-xl">
                            <FaGraduationCap size={30} className='text-primary'/>
                        </div>
                        <div className='px-3'>
                            <h1 className='text-2xl font-semibold'>+ 3000</h1>
                            <p className='text-[#60737a] font-normal'>{t('achievement.graduated')}</p>
                        </div>
                    </div>
                    <div className="py-6 flex">
                        <div className="p-6 bg-[#daf2f7] rounded-xl">
                            <FaTrophy size={30} className='text-primary'/>
                        </div>
                        <div className='px-3'>
                            <h1 className='text-2xl font-semibold'>+250</h1>
                            <p className='text-[#60737a]'>{t('achievement.graduation')}</p>
                        </div>
                    </div>
                    <div className="py-6 flex">
                        <div className="p-6 bg-[#daf2f7] rounded-xl">
                            <FaHandshake size={30} className='text-primary'/>
                        </div>
                        <div className='px-3'>
                            <h1 className='text-2xl font-semibold'>+50</h1>
                            <p className='text-[#60737a]'>{t('achievement.partners')}</p>
                        </div>
                    </div>
                    <div className="py-6 flex">
                        <div className="p-6 bg-[#daf2f7] rounded-xl">
                            <FaCogs size={30} className='text-primary'/>
                        </div>
                        <div className='px-3'>
                            <h1 className='text-2xl font-semibold'>6</h1>
                            <p className='text-[#60737a]'>{t('achievement.cycles')}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" justify-center items-center">
                <img src={Achieve} alt="achievement" className='md:order-last m-auto order-first'/>
            </div>
        </div>
    </section>
  );
};

export default Achievement;
