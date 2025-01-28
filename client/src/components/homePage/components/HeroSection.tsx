import React from 'react';
import heroImg from '../assets/heroImg.png';
import { useTranslation } from 'react-i18next';

const HeroSection: React.FC = () => {
  const { t } = useTranslation(); // Use the translation hook

  return (
    <section className='w-full bg-white py-24 p-4'>
        <div className='md:max-w-[1100px] m-auto grid md:grid-cols-2 max-w-[400px]'>
            <div className='flex flex-col justify-start gap-4'>
                <p className='py-2 text-4xl text-primary font-bold'>{t('heroSection.title')}</p>
                <h1 className='md:leading-[42px] py-2 md:text-3xl text-lg font-semibold'>
                {t('heroSection.description')}
                </h1>
                <p className='py-2 text-lg text-gray-900'>{t('heroSection.info')}</p>
            </div>
            <img src={heroImg} alt="hero" className='md:order-last order-first'/>
        </div>
    </section>
  );
}

export default HeroSection;
