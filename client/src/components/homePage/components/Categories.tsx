
import { useTranslation } from 'react-i18next';
import Achieve from '../assets/ensat-clubs.png';
const Categories = () => {
    const { t } = useTranslation(); // Use the translation hook

  return (
    <section className='w-full bg-white  p-5'>
        <div className='md:max-w-[1100px] m-auto max-w-[400px]'>
            <h1 className='md:leading-[72px] text-3xl font-bold'>
                 {t('categories.title')}
            </h1>

            <div className='pt-4'>
               <img src={Achieve} alt="achievement" className='md:order-last m-auto order-first'/>
            </div>
        </div>
    </section>
  )
}

export default Categories
